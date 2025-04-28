import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useConfigStore } from '@/store';
import AudioDisplay from './AudioDisplay';

interface AudioItem {
  id: string;
  name: string;
  uri?: string;
  path?: any;
  isPreset: boolean;
}

interface AudioConfig {
  id: string;
  config_id: string;
  use_preset: boolean;
  audio_items: string; // JSON string of audio items
  psd_low: number;
  psd_high: number;
}

const PlayConfigAudio = ({ configId }) => {
  const [audioConfigs, setAudioConfigs] = useState<AudioConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get EEG data from store
  const eegData = useConfigStore((state) => state.eegData);
  const currentPsd = eegData?.psd ?? 0;

  useEffect(() => {
    if (configId) {
      fetchAudioConfigurations();
    }
  }, [configId]);

  const fetchAudioConfigurations = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('audio_settings')
        .select('*')
        .eq('config_id', configId);

      if (error) throw error;

      if (data) {
        setAudioConfigs(data);
      }
    } catch (err) {
      console.error('Error fetching audio configurations:', err);
      setError('Failed to load audio settings');
    } finally {
      setIsLoading(false);
    }
  };

  // Parse audio items from JSON string
  const parseAudioItems = (jsonString: string): AudioItem[] => {
    try {
      return JSON.parse(jsonString);
    } catch (err) {
      console.error('Error parsing audio items:', err);
      return [];
    }
  };

  // Determine which audio config is active based on current PSD
  const getActiveAudioConfig = () => {
    return audioConfigs.find(config =>
      currentPsd >= config.psd_low && currentPsd <= config.psd_high
    );
  };

  const activeConfig = getActiveAudioConfig();

  if (isLoading) {
    return (
      <View className="py-2">
        <Text className="text-center text-gray-500">Loading audio configurations...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="py-2">
        <Text className="text-center text-red-500">{error}</Text>
      </View>
    );
  }

  if (audioConfigs.length === 0) {
    return (
      <View className="py-2">
        <Text className="text-center text-gray-500 italic">No audio configurations found</Text>
      </View>
    );
  }

  return (
    <View className="w-full px-4 mt-2">
      <Text className="text-base font-semibold text-darkPurple mb-2">Audio Configurations</Text>

      {audioConfigs.map(config => (
        <AudioDisplay
          key={config.id}
          audioItems={parseAudioItems(config.audio_items)}
          psdRange={[config.psd_low, config.psd_high]}
          title={`Audio Set ${config.id.slice(-4)}`}
          isActive={activeConfig?.id === config.id}
        />
      ))}

      {eegData && (
        <View className="bg-gray-100 p-2 rounded-md mt-2">
          <Text className="text-sm text-gray-700">
            Current PSD: {currentPsd.toFixed(2)} [dBm/Hz]
          </Text>
        </View>
      )}
    </View>
  );
};

export default PlayConfigAudio;