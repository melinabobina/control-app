import { create } from 'zustand';

export const useConfigStore = create((set) => ({
  name: '',
  height: '',
  x: '',
  y: '',
  
  setName: (name) => set({ name }),
  setHeight: (height) => set({ height }),
  setX: (x) => set({ x }),
  setY: (y) => set({ y }),
  
  resetConfig: () => set({
    name: '',
    height: '',
    x: '',
    y: '',
  }),
}));