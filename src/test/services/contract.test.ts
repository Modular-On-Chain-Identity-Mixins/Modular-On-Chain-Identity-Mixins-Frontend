import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../services/stellar', () => ({
  simulateContractCall: vi.fn(),
  sendContractCall: vi.fn(),
}));

vi.mock('@stellar/stellar-sdk', () => ({
  scValToNative: (val: unknown) => val,
  rpc: {
    Api: {
      isSimulationError: (res: any) => Boolean(res.error),
      isSimulationSuccess: (res: any) => !res.error,
      isSimulationRestore: () => false,
    },
  },
}));

import * as contract from '../../services/contract';
import * as stellar from '../../services/stellar';

describe('contract service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getIdentityProof', () => {
    it('throws when simulation returns error', async () => {
      vi.mocked(stellar.simulateContractCall).mockResolvedValue({
        error: 'No identity found',
      } as any);

      await expect(
        contract.getIdentityProof('GABC', 'GSOURCE'),
      ).rejects.toThrow('Simulation error');
    });

    it('throws when result is empty', async () => {
      vi.mocked(stellar.simulateContractCall).mockResolvedValue({
        transactionData: {} as any,
        minResourceFee: '100',
      } as any);

      await expect(
        contract.getIdentityProof('GABC', 'GSOURCE'),
      ).rejects.toThrow('No identity found');
    });

    it('parses a valid identity proof from simulation', async () => {
      vi.mocked(stellar.simulateContractCall).mockResolvedValue({
        transactionData: {} as any,
        minResourceFee: '100',
        result: {
          auth: [],
          retval: {
            address: 'GABC',
            did: 'did:stellar:abc',
            jurisdiction: 'US',
            country_code: 'US',
            tier: 'TIER_2',
            kyc_status: 'VERIFIED',
            accredited: true,
            expiry: 2000000000,
            issuer: 'GISS',
          },
        },
      } as any);

      const proof = await contract.getIdentityProof('GABC', 'GSOURCE');
      expect(proof.address).toBe('GABC');
      expect(proof.did).toBe('did:stellar:abc');
      expect(proof.jurisdiction).toBe('US');
      expect(proof.countryCode).toBe('US');
      expect(proof.tier).toBe('TIER_2');
      expect(proof.kycStatus).toBe('VERIFIED');
      expect(proof.accredited).toBe(true);
      expect(proof.issuer).toBe('GISS');
    });
  });

  describe('checkCompliance', () => {
    it('returns empty array on error simulation', async () => {
      vi.mocked(stellar.simulateContractCall).mockResolvedValue({
        error: 'Error',
      } as any);

      const results = await contract.checkCompliance('A', 'B', '100', 'GSRC');
      expect(results).toEqual([]);
    });

    it('parses compliance check results', async () => {
      vi.mocked(stellar.simulateContractCall).mockResolvedValue({
        transactionData: {} as any,
        minResourceFee: '100',
        result: {
          auth: [],
          retval: [
            { passed: true, rule: 'Jurisdiction Check', reason: null, timestamp: 1000 },
            { passed: false, rule: 'Volume Limit', reason: 'Exceeded $10k limit', timestamp: 1001 },
          ],
        },
      } as any);

      const results = await contract.checkCompliance('A', 'B', '100', 'GSRC');
      expect(results).toHaveLength(2);
      expect(results[0].passed).toBe(true);
      expect(results[0].rule).toBe('Jurisdiction Check');
      expect(results[1].passed).toBe(false);
      expect(results[1].reason).toBe('Exceeded $10k limit');
    });
  });

  describe('registerIdentity', () => {
    it('calls sendContractCall and returns tx hash', async () => {
      vi.mocked(stellar.sendContractCall).mockResolvedValue('tx-hash-123');

      const hash = await contract.registerIdentity(
        'did:stellar:abc',
        'US',
        'US',
        'TIER_2',
        'GSOURCE',
      );
      expect(hash).toBe('tx-hash-123');
    });
  });

  describe('executeTransfer', () => {
    it('sends a transfer with compliance', async () => {
      vi.mocked(stellar.sendContractCall).mockResolvedValue('tx-transfer-1');

      const hash = await contract.executeTransfer(
        { from: 'A', to: 'B', amount: '500', asset: 'TOKEN' },
        'GSOURCE',
      );
      expect(hash).toBe('tx-transfer-1');
    });
  });

  describe('getComplianceRules', () => {
    it('returns parsed rules array', async () => {
      vi.mocked(stellar.simulateContractCall).mockResolvedValue({
        transactionData: {} as any,
        minResourceFee: '100',
        result: {
          auth: [],
          retval: [
            { id: 'r1', name: 'US Only', description: 'US jurisdiction', rule_type: 'JURISDICTION_RESTRICTION', enabled: true, params: {}, priority: 0 },
          ],
        },
      } as any);

      const rules = await contract.getComplianceRules('GSRC');
      expect(rules).toHaveLength(1);
      expect(rules[0].name).toBe('US Only');
      expect(rules[0].ruleType).toBe('JURISDICTION_RESTRICTION');
    });
  });
});
