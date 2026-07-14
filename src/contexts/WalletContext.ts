import { create } from 'zustand';
import type { WalletState, Balance } from '../types';
import { connectWallet, getBalances } from '../services/stellar';

interface WalletStore extends WalletState {
  balances: Balance[];
  connect: () => Promise<void>;
  disconnect: () => void;
  refreshBalances: () => Promise<void>;
}

export const useWalletStore = create<WalletStore>((set, get) => ({
  address: null,
  publicKey: null,
  network: null,
  isConnected: false,
  isConnecting: false,
  error: null,
  balances: [],

  connect: async () => {
    set({ isConnecting: true, error: null });
    const state = await connectWallet();
    if (state.isConnected && state.publicKey && state.network) {
      const balances = await getBalances(state.publicKey, state.network);
      set({ ...state, isConnecting: false, balances });
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
}));
