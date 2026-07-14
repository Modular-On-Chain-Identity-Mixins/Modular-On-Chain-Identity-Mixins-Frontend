import { create } from 'zustand';
import type { TransactionStatus } from '../types';

interface TransactionStore {
  transactions: TransactionStatus[];
  addTransaction: (tx: TransactionStatus) => void;
  updateTransaction: (hash: string, status: TransactionStatus['status'], error?: string) => void;
  clearHistory: () => void;
}

export const useTransactionStore = create<TransactionStore>((set) => ({
  transactions: [],

  addTransaction: (tx) =>
    set((state) => ({
      transactions: [tx, ...state.transactions].slice(0, 50),
    })),

  updateTransaction: (hash, status, error) =>
    set((state) => ({
      transactions: state.transactions.map((t) =>
        t.hash === hash ? { ...t, status, error } : t,
      ),
    })),

  clearHistory: () => set({ transactions: [] }),
}));
