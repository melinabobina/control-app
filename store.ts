import { create } from 'zustand';

interface ConfigState {
  x: string;
  y: string;
  setX: (value: string) => void;
  setY: (value: string) => void;
}

export const useConfigStore = create<ConfigState>((set) => ({
  x: '',
  y: '',
  setX: (value) => set({ x: value }),
  setY: (value) => set({ y: value }),
}));
