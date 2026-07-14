import { useState, useCallback } from 'react';
import type { ComplianceRule, ComplianceCheckResult } from '../types';
import * as contract from '../services/contract';

export function useCompliance() {
  const [rules, setRules] = useState<ComplianceRule[]>([]);
  const [checkResults, setCheckResults] = useState<ComplianceCheckResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRules = useCallback(async (source: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await contract.getComplianceRules(source);
      setRules(result);
      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch rules';
      setError(msg);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const checkTransfer = useCallback(
    async (from: string, to: string, amount: string, source: string) => {
      setLoading(true);
      setError(null);
      try {
        const results = await contract.checkCompliance(from, to, amount, source);
        setCheckResults(results);
        return results;
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Compliance check failed';
        setError(msg);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const addRule = useCallback(async (rule: Omit<ComplianceRule, 'id'>, source: string) => {
    setLoading(true);
    setError(null);
    try {
      return await contract.addComplianceRule(rule, source);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to add rule';
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleRule = useCallback(async (ruleId: string, enabled: boolean, source: string) => {
    setError(null);
    try {
      return await contract.toggleRule(ruleId, enabled, source);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to toggle rule';
      setError(msg);
      return null;
    }
  }, []);

  return { rules, checkResults, loading, error, fetchRules, checkTransfer, addRule, toggleRule };
}
