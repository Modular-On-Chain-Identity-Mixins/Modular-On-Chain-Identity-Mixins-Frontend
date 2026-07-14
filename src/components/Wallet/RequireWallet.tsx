import type { ReactNode } from 'react';
import { useWalletStore } from '../../contexts/WalletContext';
import { WalletConnect } from './WalletConnect';

export function RequireWallet({ children }: { children: ReactNode }) {
  const { isConnected } = useWalletStore();

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <div className="text-4xl">🔐</div>
        <p className="text-[#9090b0] text-sm">Connect your wallet to access this feature</p>
        <WalletConnect />
      </div>
    );
  }

  return <>{children}</>;
}
