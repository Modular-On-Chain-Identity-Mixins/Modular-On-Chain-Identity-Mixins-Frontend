import { useWalletStore } from '../../contexts/WalletContext';
import { Badge } from '../UI/Badge';

const NETWORKS = ['TESTNET', 'MAINNET'] as const;

export function NetworkSelector() {
  const { network, isConnected, disconnect, setDesiredNetwork } = useWalletStore();

  if (!isConnected) return null;

  const handleSwitch = (newNetwork: 'TESTNET' | 'MAINNET') => {
    if (newNetwork === network) return;
    setDesiredNetwork(newNetwork);
    disconnect();
  };

  return (
    <div className="flex items-center gap-2">
      {NETWORKS.map((n) => (
        <button
          key={n}
          onClick={() => handleSwitch(n)}
          disabled={network === n}
          className="transition-opacity disabled:opacity-100 opacity-60 hover:opacity-100"
          aria-label={`Switch to ${n}`}
        >
          <Badge variant={n === 'MAINNET' ? 'success' : 'info'} size="sm">
            {network === n ? `● ${n}` : n}
          </Badge>
        </button>
      ))}
    </div>
  );
}
