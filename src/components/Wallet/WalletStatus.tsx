import { useWalletStore } from '../../contexts/WalletContext';
import { Card, CardTitle, CardContent } from '../UI/Card';
import { formatBalance } from '../../services/format';

export function WalletStatus() {
  const { isConnected, address, network, balances } = useWalletStore();

  if (!isConnected) return null;

  return (
    <Card variant="default">
      <CardTitle>Account Overview</CardTitle>
      <CardContent className="space-y-3">
        <div className="text-sm">
          <span className="text-[#606080]">Address: </span>
          <span className="text-[#e8e8f0] font-mono text-xs">{address}</span>
        </div>
        <div className="text-sm">
          <span className="text-[#606080]">Network: </span>
          <span className="text-[#e8e8f0]">{network}</span>
        </div>
        {balances.length > 0 && (
          <div>
            <p className="text-sm text-[#606080] mb-2">Balances</p>
            <div className="space-y-1.5">
              {balances.map((b) => (
                <div key={b.asset} className="flex items-center justify-between py-1 px-3 rounded-lg bg-[#13131a]">
                  <span className="text-sm text-[#e8e8f0]">{b.asset}</span>
                  <span className="text-sm font-mono text-[#9090b0]">
                    {formatBalance(b.balance, 4)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
