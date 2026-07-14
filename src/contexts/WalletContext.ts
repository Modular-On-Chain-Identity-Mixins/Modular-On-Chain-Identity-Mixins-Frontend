import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { WalletState, Balance } from '../types';
import { connectWallet, getBalances } from '../services/stellar';

interface WalletStore extends WalletState {
  balances: Balance[];
  desiredNetwork: 'TESTNET' | 'MAINNET';
  setDesiredNetwork: (network: 'TESTNET' | 'MAINNET') => void;
  connect: () => Promise<void>;
  disconnect: () => void;
  refreshBalances: () => Promise<void>;
}

export const useWalletStore = create<WalletStore>()(
  persist(
    (set, get) => ({
      address: null,
      publicKey: null,
      network: null,
      isConnected: false,
      isConnecting: false,
      error: null,
      balances: [],
      desiredNetwork: 'TESTNET',

      setDesiredNetwork: (desiredNetwork) => set({ desiredNetwork }),

      connect: async () => {
        const { desiredNetwork } = get();
        set({ isConnecting: true, error: null });
        const state = await connectWallet(desiredNetwork);
        if (state.isConnected && state.publicKey && state.network) {
          const balances = await getBalances(state.publicKey, state.network);
          set({ ...state, desiredNetwork, isConnecting: false, balances });
        } else {
          set({ ...state, isConnecting: false });
        }
      },

      disconnect: () => {
        set({
          address: null,
          publicKey: null,
          network: null,
          isConnected: false,
          isConnecting: false,
          error: null,
          balances: [],
        });
      },

      refreshBalances: async () => {
        const { isConnected, publicKey, network } = get();
        if (isConnected && publicKey && network) {
          const balances = await getBalances(publicKey, network);
          set({ balances });
        }
      },
    }),
    { name: 'wallet-storage' },
  ),
);
