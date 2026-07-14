import { useState } from 'react';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';
import { Select } from '../UI/Select';
import { Modal } from '../UI/Modal';
import { useCompliance } from '../../hooks/useCompliance';
import { useWalletStore } from '../../contexts/WalletContext';
import { toast } from '../UI/Toast';
import type { RuleType } from '../../types';

const RULE_TYPES: { value: RuleType; label: string }[] = [
  { value: 'JURISDICTION_RESTRICTION', label: 'Jurisdiction Restriction' },
  { value: 'TIER_THRESHOLD', label: 'Tier Threshold' },
  { value: 'DAILY_VOLUME_LIMIT', label: 'Daily Volume Limit' },
  { value: 'ACCREDITED_ONLY', label: 'Accredited Only' },
  { value: 'TRANSFER_TAX', label: 'Transfer Tax' },
  { value: 'COOLDOWN_PERIOD', label: 'Cooldown Period' },
  { value: 'WHITELIST_ONLY', label: 'Whitelist Only' },
  { value: 'CUSTOM', label: 'Custom Rule' },
];

interface RuleEditorProps {
  open: boolean;
  onClose: () => void;
}

export function RuleEditor({ open, onClose }: RuleEditorProps) {
  const { addRule, loading } = useCompliance();
  const { publicKey } = useWalletStore();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [ruleType, setRuleType] = useState<RuleType>('CUSTOM');
  const [priority, setPriority] = useState('0');
  const [paramsKey, setParamsKey] = useState('');
  const [paramsValue, setParamsValue] = useState('');
  const [params, setParams] = useState<Record<string, string>>({});

  const addParam = () => {
    if (paramsKey) {
      setParams((prev) => ({ ...prev, [paramsKey]: paramsValue }));
      setParamsKey('');
      setParamsValue('');
    }
  };

  const handleSubmit = async () => {
    if (!publicKey || !name) {
      toast('Name is required', 'warning');
      return;
    }
    const txHash = await addRule(
      {
        name,
        description,
        ruleType,
        enabled: true,
        params: params as unknown as Record<string, string | number | boolean>,
        priority: parseInt(priority) || 0,
      },
      publicKey,
    );
    if (txHash) {
      toast('Rule added successfully', 'success');
      onClose();
      setName('');
      setDescription('');
      setRuleType('CUSTOM');
      setPriority('0');
      setParams({});
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Add Compliance Rule" size="lg">
      <div className="space-y-4">
        <Input label="Rule Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., US Transfer Restriction" />
        <Input label="Description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the rule's purpose" />
        <div className="grid grid-cols-2 gap-4">
          <Select label="Rule Type" value={ruleType} onChange={(e) => setRuleType(e.target.value as RuleType)} options={RULE_TYPES} />
          <Input label="Priority (lower = first)" type="number" value={priority} onChange={(e) => setPriority(e.target.value)} />
        </div>
        <div>
          <p className="text-sm font-medium text-[#9090b0] mb-2">Parameters</p>
          <div className="flex gap-2 mb-2">
            <Input placeholder="Key" value={paramsKey} onChange={(e) => setParamsKey(e.target.value)} className="flex-1" />
            <Input placeholder="Value" value={paramsValue} onChange={(e) => setParamsValue(e.target.value)} className="flex-1" />
            <Button size="sm" variant="secondary" onClick={addParam}>Add</Button>
          </div>
          {Object.keys(params).length > 0 && (
            <div className="space-y-1">
              {Object.entries(params).map(([k, v]) => (
                <div key={k} className="flex items-center justify-between px-3 py-1.5 rounded bg-[#13131a] text-sm">
                  <span className="text-[#e8e8f0]">{k}</span>
                  <span className="text-[#9090b0]">{v}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} loading={loading}>Add Rule</Button>
        </div>
      </div>
    </Modal>
  );
}
