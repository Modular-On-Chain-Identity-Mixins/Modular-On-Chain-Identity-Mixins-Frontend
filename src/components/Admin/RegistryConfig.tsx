import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../UI/Card';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';
import { Badge } from '../UI/Badge';
import { Toggle } from '../UI/Toggle';
import { useWalletStore } from '../../contexts/WalletContext';
import { toast } from '../UI/Toast';
import * as contract from '../../services/contract';
import type { RegistryConfig as RegistryConfigType } from '../../types';

export function RegistryConfig() {
  const { publicKey, isConnected } = useWalletStore();
  const [config, setConfig] = useState<RegistryConfigType | null>(null);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const fetchConfig = async () => {
    if (!publicKey) return;
    setLoading(true);
    try {
      const data = await contract.getRegistryConfig(publicKey);
      setConfig(data);
    } catch {
      toast('Failed to load registry config', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected && publicKey) fetchConfig();
  }, [isConnected, publicKey, fetchConfig]);

  const handleSave = async () => {
    if (!publicKey || !config) return;
    const txHash = await contract.updateRegistryConfig(config, publicKey);
    if (txHash) {
      toast('Configuration updated', 'success');
      setEditMode(false);
    }
  };

  if (!config) {
    return (
      <Card variant="default">
        <CardTitle>Registry Configuration</CardTitle>
        <CardContent>
          {loading ? (
            <div className="flex items-center gap-3 text-sm text-[#606080] py-4">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Loading config...
            </div>
          ) : (
            <p className="text-sm text-[#606080]">Unable to load configuration</p>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="default">
      <CardHeader>
        <CardTitle>Registry Configuration</CardTitle>
        <div className="flex gap-2">
          {editMode ? (
            <>
              <Button size="sm" variant="secondary" onClick={() => setEditMode(false)}>Cancel</Button>
              <Button size="sm" onClick={handleSave}>Save</Button>
            </>
          ) : (
            <Button size="sm" variant="secondary" onClick={() => setEditMode(true)}>Edit</Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 rounded-lg bg-[#13131a]">
            <p className="text-xs text-[#606080]">Contract ID</p>
            <p className="text-sm font-mono text-[#e8e8f0] truncate">{config.contractId}</p>
          </div>
          <div className="p-3 rounded-lg bg-[#13131a]">
            <p className="text-xs text-[#606080]">Owner</p>
            <p className="text-sm font-mono text-[#e8e8f0] truncate">{config.owner}</p>
          </div>
        </div>
        <div className="flex items-center justify-between p-3 rounded-lg bg-[#13131a]">
          <span className="text-sm text-[#e8e8f0]">Verification Required</span>
          <Toggle
            enabled={config.verificationRequired}
            onChange={(v) => setConfig({ ...config, verificationRequired: v })}
            disabled={!editMode}
          />
        </div>
        <div>
          <p className="text-xs text-[#606080] mb-2">Min Verification Tier</p>
          <Badge variant={config.minTier === 'TIER_3' ? 'accent' : config.minTier === 'TIER_2' ? 'info' : 'neutral'}>
            {config.minTier.replace('_', ' ')}
          </Badge>
        </div>
        <div>
          <p className="text-xs text-[#606080] mb-2">Allowed Jurisdictions</p>
          <div className="flex flex-wrap gap-1.5">
            {config.allowedJurisdictions.length > 0 ? (
              config.allowedJurisdictions.map((j) => (
                <Badge key={j} variant="info" size="sm">{j}</Badge>
              ))
            ) : (
              <span className="text-sm text-[#606080]">All jurisdictions</span>
            )}
          </div>
        </div>
        <Input
          label="Daily Volume Limit"
          value={config.dailyVolumeLimit}
          onChange={(e) => setConfig({ ...config, dailyVolumeLimit: e.target.value })}
          disabled={!editMode}
        />
      </CardContent>
    </Card>
  );
}
