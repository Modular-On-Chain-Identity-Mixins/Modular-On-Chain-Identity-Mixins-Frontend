import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../UI/Card';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';
import { Badge } from '../UI/Badge';
import { useWalletStore } from '../../contexts/WalletContext';
import { toast } from '../UI/Toast';
import * as contract from '../../services/contract';
import type { WhitelistEntry } from '../../types';

export function WhitelistManager() {
  const { publicKey, isConnected } = useWalletStore();
  const [entries, setEntries] = useState<WhitelistEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState('');
  const [label, setLabel] = useState('');

  const fetchWhitelist = async () => {
    if (!publicKey) return;
    setLoading(true);
    try {
      const data = await contract.getWhitelist(publicKey);
      setEntries(data);
    } catch {
      toast('Failed to load whitelist', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected && publicKey) fetchWhitelist();
  }, [isConnected, publicKey, fetchWhitelist]);

  const handleAdd = async () => {
    if (!publicKey || !address) {
      toast('Enter an address', 'warning');
      return;
    }
    const txHash = await contract.addToWhitelist(address, label, publicKey);
    if (txHash) {
      toast('Address added to whitelist', 'success');
      setAddress('');
      setLabel('');
      fetchWhitelist();
    }
  };

  const handleRemove = async (addr: string) => {
    if (!publicKey) return;
    const txHash = await contract.removeFromWhitelist(addr, publicKey);
    if (txHash) {
      toast('Address removed from whitelist', 'info');
      fetchWhitelist();
    }
  };

  return (
    <Card variant="default">
      <CardHeader>
        <CardTitle>Whitelist Manager</CardTitle>
        <Badge variant="info">{entries.length} entries</Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Stellar address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="flex-1"
          />
          <Input
            placeholder="Label (optional)"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="w-40"
          />
          <Button size="sm" onClick={handleAdd}>Add</Button>
        </div>

        {loading ? (
          <div className="flex items-center gap-3 text-sm text-[#606080] py-4">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Loading whitelist...
          </div>
        ) : entries.length === 0 ? (
          <p className="text-sm text-[#606080]">No whitelisted addresses</p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {entries.map((entry) => (
              <div
                key={entry.address}
                className="flex items-center gap-3 p-2.5 rounded-lg bg-[#13131a]"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-mono text-[#e8e8f0] truncate">
                    {entry.address.slice(0, 12)}...{entry.address.slice(-6)}
                  </p>
                  {entry.label && (
                    <p className="text-xs text-[#606080]">{entry.label}</p>
                  )}
                </div>
                <Badge variant={entry.active ? 'success' : 'neutral'} size="sm">
                  {entry.active ? 'Active' : 'Inactive'}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemove(entry.address)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
