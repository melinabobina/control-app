import { create } from 'zustand';

interface EEGData {
  alpha_band: number;
  beta_band: number;
  theta_band: number;
  delta_band: number;
  gamma_band: number;
  dominant_band: string;
  alpha_beta_ratio: number;
  alpha_delta_ratio: number;
  peak_alpha_freq: number;
  psd: number;
  timestamp: string;
}
export interface AudioItemAudioItem {
  user_id: userId,
  config_name: name,
  uri?: string;
  path?: any;
  pitch?: number;
}

interface ConfigState {
    name: string;
    height: string;
    x: string;
    y: string;
    eegData: EEGData | null;
    configId: string | null;  // Add this to track the current config ID
    hasAudio: boolean;        // Flag to track if config has audio
    audioItems: AudioItem[];  // Store audio items
    isPlaying: boolean;

    setName: (name: string) => void;
    setHeight: (height: string) => void;
    setX: (x: string) => void;
    setY: (y: string) => void;
    setEegData: (data: EEGData) => void;
    setConfigId: (id: string | null) => void;     // Add setter for config ID
    setHasAudio: (hasAudio: boolean) => void;     // Add setter for audio flag
    setAudioItems: (items: AudioItem[]) => void;  // Add setter for audio items
    setIsPlaying: (isPlaying: boolean) => void;
    resetConfig: () => void;
  }


export const useConfigStore = create<ConfigState>((set) => ({
  name: '',
  height: '',
  x: '',
  y: '',
  eegData: null,
  configId: null,     // Initialize with null
  hasAudio: false,    // Initialize with false
  audioItems: [],     // Initialize with empty array
  isPlaying: false,

  setName: (name) => set({ name }),
  setHeight: (height) => set({ height }),
  setX: (x) => set({ x }),
  setY: (y) => set({ y }),
  setEegData: (data) => set({ eegData: data }),
  setConfigId: (configId) => set({ configId }),
  setHasAudio: (hasAudio) => set({ hasAudio }),
  setAudioItems: (audioItems) => set({ audioItems }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),

  resetConfig: () =>
    set({
      name: '',
      height: '',
      x: '',
      y: '',
      eegData: null,
      configId: null,     // Reset configId
      hasAudio: false,    // Reset hasAudio
      audioItems: [],     // Reset audioItems
      isPlaying: false,
    }),
}));
