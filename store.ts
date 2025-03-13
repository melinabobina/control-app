import { create } from 'zustand';

interface ConfigState {
  x: string;
  y: string;
  setX: (value: string) => void;
  setY: (value: string) => void;
  setName: (value: string) => void;
  setHeight: (value: string) => void;
}

export const useConfigStore = create<ConfigState>((set) => ({
  x: '',
  y: '',
  name: '',
  height: '',
  setX: (value) => set({ x: value }),
  setY: (value) => set({ y: value }),
  setName: (value) => set({ name: value }),
  setHeight: (value) => set({ height: value }),
}));
