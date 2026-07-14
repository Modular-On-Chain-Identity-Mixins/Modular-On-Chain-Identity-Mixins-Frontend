import { useWalletStore } from '../contexts/WalletContext';

export function useWallet() {
  const store = useWalletStore();
  return store;
}
