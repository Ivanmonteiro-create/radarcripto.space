// store/useTrades.ts
import { create } from "zustand";

interface Trade {
  id: string;
  pair: string;
  type: "buy" | "sell";
  amount: number;
  price: number;
  timestamp: number;
}

interface TradesState {
  trades: Trade[];
  addTrade: (trade: Trade) => void;
  resetTrades: () => void;
}

export const useTrades = create<TradesState>((set) => ({
  trades: [],
  addTrade: (trade) =>
    set((state) => ({ trades: [...state.trades, trade] })),
  resetTrades: () => set({ trades: [] }),
}));
