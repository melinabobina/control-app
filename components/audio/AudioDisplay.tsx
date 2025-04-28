import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import AudioPlayer from './AudioPlayer';
import AudioVisualization from './AudioVisualization';

interface AudioItem {
  id: string;
  name: string;
  uri?: string;
  path?: any;
  isPreset: boolean;
}

interface AudioDisplayProps {
  audioItems: AudioItem[];
  psdRange?: [number, number];
  title?: string;
  isActive?: boolean;
}

const AudioDisplay: React.FC<AudioDisplayProps> = ({
  audioItems,
  psdRange = [0, 100],
  title = 'Audio Configuration',
  isActive = false,
}) => {
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string | null>(null);

  const handlePlaybackEnd = () => {
    setCurrentlyPlayingId(null);
  };

  return (
    <View className="bg-white rounded-lg shadow-md p-4 my-2">
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-lg font-bold text-darkPurple">{title}</Text>

        {isActive && (
          <View className="flex-row items-center">
            <View className="w-2 h-2 rounded-full bg-green-500 mr-1" />
            <Text className="text-sm text-green-500 font-medium">Active</Text>
          </View>
        )}
      </View>

      <View className="bg-gray-100 rounded-md p-2 mb-3">
        <Text className="text-darkMauve text-sm">
          PSD Range: {psdRange[0]} - {psdRange[1]} [dBm/Hz]
        </Text>
      </View>

      {isActive && <AudioVisualization isPlaying={true} />}

      <View className="mt-2">
        <Text className="text-darkPurple font-medium mb-2">
          Audio clips ({audioItems.length}):
        </Text>

        {audioItems.length > 0 ? (
          <ScrollView style={{ maxHeight: 150 }}>
            {audioItems.map((item) => (
              <View key={item.id} className="py-2 border-b border-gray-100">
                <AudioPlayer
                  audioItem={item}
                  onPlaybackEnd={handlePlaybackEnd}
                />
              </View>
            ))}
          </ScrollView>
        ) : (
          <Text className="text-gray-400 italic">No audio clips configured</Text>
        )}
      </View>
    </View>
  );
};

export default AudioDisplay;