// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { TransferPage } from '../../pages/TransferPage';

vi.mock('../../contexts/WalletContext', () => ({
  useWalletStore: vi.fn(),
}));

vi.mock('../../services/contract', () => ({
  checkCompliance: vi.fn(),
  executeTransfer: vi.fn(),
}));

import { useWalletStore } from '../../contexts/WalletContext';
import * as contract from '../../services/contract';

const mockWallet = {
  isConnected: true,
  address: 'GABCDEF1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF123456',
  publicKey: 'GABCDEF1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF123456',
  network: 'TESTNET' as const,
  isConnecting: false,
  error: null,
  balances: [{ asset: 'XLM', balance: '5000' }],
  connect: vi.fn(),
  disconnect: vi.fn(),
  refreshBalances: vi.fn(),
};

function renderTransferPage() {
  return render(
    <BrowserRouter>
      <TransferPage />
    </BrowserRouter>,
  );
}

describe('TransferPage — full flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useWalletStore).mockReturnValue(mockWallet);
  });

  it('renders the transfer form with sender pre-filled', () => {
    renderTransferPage();
    expect(screen.getByText('Token Transfers')).toBeDefined();
    expect(screen.getByDisplayValue(/GABCDEF/)).toBeDefined();
  });

  it('shows compliance flow steps', () => {
    renderTransferPage();
    expect(screen.getByText('Compliance Flow')).toBeDefined();
    expect(screen.getByText(/mixin intercepts/)).toBeDefined();
    expect(screen.getByText(/Identity Registry verifies/)).toBeDefined();
  });

  it('fills form and runs compliance check', async () => {
    vi.mocked(contract.checkCompliance).mockResolvedValue([
      { passed: true, rule: 'Jurisdiction', timestamp: Date.now() },
      { passed: true, rule: 'Volume Limit', timestamp: Date.now() },
    ]);

    renderTransferPage();

    fireEvent.change(screen.getByLabelText('Recipient'), {
      target: { value: 'GXZZZ1234567890' },
    });
    fireEvent.change(screen.getByLabelText('Amount'), {
      target: { value: '250' },
    });

    fireEvent.click(screen.getByText('Check Compliance'));

    await waitFor(() => {
      expect(contract.checkCompliance).toHaveBeenCalledWith(
        mockWallet.address,
        'GXZZZ1234567890',
        '250',
        mockWallet.publicKey,
      );
    });

    await waitFor(() => {
      expect(screen.getByText(/Compliance Verified/)).toBeDefined();
    });
  });

  it('blocks transfer when compliance fails', async () => {
    vi.mocked(contract.checkCompliance).mockResolvedValue([
      { passed: false, rule: 'Jurisdiction', reason: 'US restricted', timestamp: Date.now() },
    ]);

    renderTransferPage();

    fireEvent.change(screen.getByLabelText('Recipient'), {
      target: { value: 'GRESTRICTED123' },
    });
    fireEvent.change(screen.getByLabelText('Amount'), {
      target: { value: '100' },
    });

    fireEvent.click(screen.getByText('Check Compliance'));

    await waitFor(() => {
      expect(
        screen.getByText(/Compliance Check Failed/),
      ).toBeDefined();
    });
  });

  it('submits a transfer when compliance passes', async () => {
    vi.mocked(contract.checkCompliance).mockResolvedValue([
      { passed: true, rule: 'All', timestamp: Date.now() },
    ]);
    vi.mocked(contract.executeTransfer).mockResolvedValue('tx-hash-abc-123');

    renderTransferPage();

    fireEvent.change(screen.getByLabelText('Recipient'), {
      target: { value: 'GXZZZ1234567890' },
    });
    fireEvent.change(screen.getByLabelText('Amount'), {
      target: { value: '100' },
    });

    fireEvent.click(screen.getByText('Check Compliance'));
    await waitFor(() => {
      expect(screen.getByText(/Compliance Verified/)).toBeDefined();
    });

    fireEvent.click(screen.getByText('Transfer'));

    await waitFor(() => {
      expect(contract.executeTransfer).toHaveBeenCalledWith(
        {
          from: mockWallet.address,
          to: 'GXZZZ1234567890',
          amount: '100',
          asset: 'SOROBAN_TOKEN',
        },
        mockWallet.publicKey,
      );
    });
  });
});
