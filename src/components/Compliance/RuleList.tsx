import { useCompliance } from '../../hooks/useCompliance';
import { useWalletStore } from '../../contexts/WalletContext';
import { Card, CardHeader, CardTitle, CardContent } from '../UI/Card';
import { Badge } from '../UI/Badge';
import { Toggle } from '../UI/Toggle';
import { toast } from '../UI/Toast';
import { useEffect } from 'react';
import type { ComplianceRule, RuleType } from '../../types';

const RULE_TYPE_LABELS: Record<RuleType, string> = {
  JURISDICTION_RESTRICTION: 'Jurisdiction Restriction',
  TIER_THRESHOLD: 'Tier Threshold',
  DAILY_VOLUME_LIMIT: 'Daily Volume Limit',
  ACCREDITED_ONLY: 'Accredited Only',
  TRANSFER_TAX: 'Transfer Tax',
  COOLDOWN_PERIOD: 'Cooldown Period',
  WHITELIST_ONLY: 'Whitelist Only',
  CUSTOM: 'Custom Rule',
};

const RULE_TYPE_VARIANTS: Record<RuleType, 'info' | 'warning' | 'danger' | 'accent' | 'success' | 'neutral'> = {
  JURISDICTION_RESTRICTION: 'warning',
  TIER_THRESHOLD: 'info',
  DAILY_VOLUME_LIMIT: 'danger',
  ACCREDITED_ONLY: 'accent',
  TRANSFER_TAX: 'neutral',
  COOLDOWN_PERIOD: 'info',
  WHITELIST_ONLY: 'success',
  CUSTOM: 'neutral',
};

export function RuleList() {
  const { rules, loading, fetchRules, toggleRule } = useCompliance();
  const { publicKey, isConnected } = useWalletStore();

  useEffect(() => {
    if (isConnected && publicKey) {
      fetchRules(publicKey);
    }
  }, [isConnected, publicKey, fetchRules]);

  const handleToggle = async (ruleId: string, enabled: boolean) => {
    if (!publicKey) return;
    const txHash = await toggleRule(ruleId, enabled, publicKey);
    if (txHash) {
      toast(`Rule ${enabled ? 'enabled' : 'disabled'}`, 'success');
      fetchRules(publicKey);
    }
  };

  return (
    <Card variant="default">
      <CardHeader>
        <CardTitle>Compliance Rules</CardTitle>
        <Badge variant={rules.length > 0 ? 'info' : 'neutral'}>
          {rules.length} active
        </Badge>
      </CardHeader>
      <CardContent>
        {loading && rules.length === 0 ? (
          <div className="flex items-center gap-3 text-sm text-[#606080] py-4">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Loading rules...
          </div>
        ) : rules.length === 0 ? (
          <p className="text-sm text-[#606080] py-4">No compliance rules configured</p>
        ) : (
          <div className="space-y-2">
            {rules.map((rule) => (
              <RuleItem
                key={rule.id}
                rule={rule}
                onToggle={handleToggle}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function RuleItem({
  rule,
  onToggle,
}: {
  rule: ComplianceRule;
  onToggle: (id: string, enabled: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-[#13131a] border border-[#2a2a3d] hover:border-[#3b3b5c] transition-colors">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[#e8e8f0]">{rule.name}</span>
          <Badge variant={RULE_TYPE_VARIANTS[rule.ruleType]} size="sm">
            {RULE_TYPE_LABELS[rule.ruleType]}
          </Badge>
        </div>
        <p className="text-xs text-[#606080] mt-0.5 truncate">{rule.description}</p>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-[#606080]">P{rule.priority}</span>
        <Toggle
          enabled={rule.enabled}
          onChange={(enabled) => onToggle(rule.id, enabled)}
        />
      </div>
    </div>
  );
}
