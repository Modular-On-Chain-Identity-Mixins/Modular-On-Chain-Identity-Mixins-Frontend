import { useEffect } from 'react';
import { useWalletStore } from '../../contexts/WalletContext';
import { Card, CardHeader, CardTitle, CardContent } from '../UI/Card';
import { Button } from '../UI/Button';
import { EmptyState } from '../UI/EmptyState';
import { toast } from '../UI/Toast';
import { CopyButton } from '../../hooks/useClipboard';

const POLL_INTERVAL = 30_000;

export function TokenBalance() {
  const { balances, refreshBalances, isConnected } = useWalletStore();

  useEffect(() => {
    if (!isConnected) return;
    const id = setInterval(() => refreshBalances(), POLL_INTERVAL);
    return () => clearInterval(id);
  }, [isConnected, refreshBalances]);

  if (!isConnected) return null;

  return (
    <Card variant="glass">
      <CardHeader>
        <CardTitle>Token Balances</CardTitle>
        <Button variant="ghost" size="sm" onClick={() => { refreshBalances(); toast('Balances refreshed', 'info'); }}>
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {balances.length === 0 ? (
          <EmptyState icon="💰" title="No tokens found" description="Balances will appear here once you hold tokens" />
        ) : (
          <div className="space-y-2">
            {balances.map((b) => (
              <div
                key={b.asset}
                className="flex items-center justify-between p-3 rounded-lg bg-[#13131a]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-[#6c5ce7]/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-[#6c5ce7]">
                      {b.asset.slice(0, 2)}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#e8e8f0]">{b.asset}</p>
                    {b.contractId && (
                      <div className="flex items-center gap-1">
                        <p className="text-xs text-[#606080] truncate max-w-[160px]">
                          {b.contractId}
                        </p>
                        <CopyButton text={b.contractId} label="Copy contract ID" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <p className="text-sm font-mono text-[#e8e8f0]">
                    {Number(b.balance).toLocaleString(undefined, {
                      maximumFractionDigits: 7,
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
