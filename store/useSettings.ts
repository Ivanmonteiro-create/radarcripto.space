// store/useSettings.ts
import { create } from "zustand";

interface SettingsState {
  balance: number;
  risk: number;
  setBalance: (balance: number) => void;
  setRisk: (risk: number) => void;
}

export const useSettings = create<SettingsState>((set) => ({
  balance: 1000,
  risk: 1,
  setBalance: (balance) => set({ balance }),
  setRisk: (risk) => set({ risk }),
}));
