import { useState, useCallback } from 'react';
import type { IdentityProof } from '../types';
import * as contract from '../services/contract';

export function useIdentity() {
  const [identity, setIdentity] = useState<IdentityProof | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchIdentity = useCallback(async (address: string, source: string) => {
    setLoading(true);
    setError(null);
    try {
      const proof = await contract.getIdentityProof(address, source);
      setIdentity(proof);
      return proof;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch identity';
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const registerIdentity = useCallback(
    async (
      did: string,
      jurisdiction: string,
      countryCode: string,
      tier: string,
      source: string,
    ) => {
      setLoading(true);
      setError(null);
      try {
        return await contract.registerIdentity(
          did,
          jurisdiction,
          countryCode,
          tier as any,
          source,
        );
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Registration failed';
        setError(msg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { identity, loading, error, fetchIdentity, registerIdentity };
}
