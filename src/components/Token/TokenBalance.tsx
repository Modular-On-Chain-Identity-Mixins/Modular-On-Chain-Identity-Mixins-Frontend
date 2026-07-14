import { useWalletStore } from '../../contexts/WalletContext';
import { Card, CardHeader, CardTitle, CardContent } from '../UI/Card';
import { Button } from '../UI/Button';
import { toast } from '../UI/Toast';

export function TokenBalance() {
  const { balances, refreshBalances, isConnected } = useWalletStore();

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
          <p className="text-sm text-[#606080]">No tokens found</p>
        ) : (
          <div className="space-y-2">
            {balances.map((b) => (
              <div
                key={b.asset}
                className="flex items-center justify-between p-3 rounded-lg bg-[#13131a]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#6c5ce7]/20 flex items-center justify-center">
                    <span className="text-xs font-bold text-[#6c5ce7]">
                      {b.asset.slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#e8e8f0]">{b.asset}</p>
                    {b.contractId && (
                      <p className="text-xs text-[#606080] truncate max-w-[200px]">
                        {b.contractId}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
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
