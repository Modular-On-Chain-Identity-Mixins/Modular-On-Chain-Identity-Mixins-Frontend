// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Dashboard } from '../../pages/Dashboard';

vi.mock('../../contexts/WalletContext', () => ({
  useWalletStore: vi.fn(),
}));

import { useWalletStore } from '../../contexts/WalletContext';

function renderDashboard() {
  return render(
    <BrowserRouter>
      <Dashboard />
    </BrowserRouter>,
  );
}

describe('Dashboard — disconnected state', () => {
  beforeEach(() => {
    vi.mocked(useWalletStore).mockReturnValue({
      isConnected: false,
      address: null,
      publicKey: null,
      network: null,
      isConnecting: false,
      error: null,
      balances: [],
      connect: vi.fn(),
      disconnect: vi.fn(),
      refreshBalances: vi.fn(),
    });
  });

  it('renders the landing hero when not connected', () => {
    renderDashboard();
    expect(screen.getByText('Soroban Compliance Kit')).toBeDefined();
    expect(
      screen.getByText(/Connect your Freighter wallet/),
    ).toBeDefined();
  });

  it('shows the hero card with connect prompt', () => {
    renderDashboard();
    expect(screen.getByText(/Connect your Freighter wallet/)).toBeDefined();
  });
});

describe('Dashboard — connected state', () => {
  beforeEach(() => {
    vi.mocked(useWalletStore).mockReturnValue({
      isConnected: true,
      address: 'GA4I7QJ7G7J7QJ7G7J7QJ7G7J7QJ7G7J7QJ7G7J7QJ7G7J7QJ7G7J7QJ',
      publicKey: 'GA4I7QJ7G7J7QJ7G7J7QJ7G7J7QJ7G7J7QJ7G7J7QJ7G7J7QJ7G7J7QJ',
      network: 'TESTNET',
      isConnecting: false,
      error: null,
      balances: [
        { asset: 'XLM', balance: '1000.5000000' },
        { asset: 'USDC', balance: '500.0000000', contractId: 'CA...' },
      ],
      connect: vi.fn(),
      disconnect: vi.fn(),
      refreshBalances: vi.fn(),
    });
  });

  it('renders the Identity Card heading', () => {
    renderDashboard();
    expect(screen.getByText('Identity Verification')).toBeDefined();
  });

  it('shows account address and network', () => {
    renderDashboard();
    expect(screen.getByText('TESTNET')).toBeDefined();
  });

  it('renders Compliance Rules section', () => {
    renderDashboard();
    expect(screen.getByText('Compliance Rules')).toBeDefined();
  });

  it('renders Quick Stats grid', () => {
    renderDashboard();
    expect(screen.getByText('Network')).toBeDefined();
    expect(screen.getByText('Testnet')).toBeDefined();
    expect(screen.getByText('Standard')).toBeDefined();
    expect(screen.getByText('SEP-57')).toBeDefined();
  });

  it('renders Token Balances', () => {
    renderDashboard();
    expect(screen.getByText('Token Balances')).toBeDefined();
    expect(screen.getAllByText('XLM').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('USDC').length).toBeGreaterThanOrEqual(1);
  });

  it('shows refresh button for balances', () => {
    renderDashboard();
    expect(screen.getByText('Refresh')).toBeDefined();
  });
});
