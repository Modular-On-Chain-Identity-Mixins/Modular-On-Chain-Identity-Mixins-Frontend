import { useWalletStore } from '../../contexts/WalletContext';
import { Button } from '../UI/Button';
import { Card } from '../UI/Card';
import { Badge } from '../UI/Badge';
import { toast } from '../UI/Toast';
import { formatAddress } from '../../services/format';

export function WalletConnect() {
  const { isConnected, isConnecting, address, network, error, connect, disconnect } = useWalletStore();

  const handleConnect = async () => {
    await connect();
    const { isConnected: connected, error: err } = useWalletStore.getState();
    if (connected) {
      toast('Wallet connected successfully', 'success');
    } else if (err) {
      toast(err, 'error');
    }
  };

  const handleDisconnect = () => {
    disconnect();
    toast('Wallet disconnected', 'info');
  };

  if (isConnected && address) {
    return (
      <Card variant="glass" className="flex items-center gap-4 p-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-full bg-[#6c5ce7]/20 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-[#6c5ce7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-[#e8e8f0] truncate">
              {formatAddress(address)}
            </p>
            <Badge variant={network === 'MAINNET' ? 'success' : 'info'}>
              {network || 'Unknown'}
            </Badge>
          </div>
        </div>
        <Button variant="secondary" size="sm" onClick={handleDisconnect}>
          Disconnect
        </Button>
      </Card>
    );
  }

  return (
    <Card variant="glass" className="p-4">
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <p className="text-sm font-medium text-[#e8e8f0]">Connect Wallet</p>
          <p className="text-xs text-[#606080]">Connect Freighter to interact</p>
        </div>
        <Button onClick={handleConnect} loading={isConnecting} size="sm">
          Connect
        </Button>
      </div>
      {error && <p className="mt-2 text-xs text-[#ff1744]">{error}</p>}
    </Card>
  );
}
