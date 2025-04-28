import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Audio } from 'expo-av';
import { icons } from '@/constants'; // Updated path

interface AudioItem {
  id: string;
  name: string;
  uri?: string;
  path?: any;
  pitch?: number;
  isPreset: boolean;
}

interface AudioSelectorProps {
  onAudioSelected: (selectedAudios: AudioItem[]) => void;
  initialAudios?: AudioItem[];
  maxItems?: number;
  preset?: boolean;
}

// Define preset audio options
const PRESET_AUDIO = [
  { id: '1', name: 'Bright Star', path: require('@/assets/sounds/synth-bright-star.wav') },
  { id: '2', name: 'Cream', path: require('@/assets/sounds/synth-cream.wav') },
  { id: '3', name: 'Tah-Dah', path: require('@/assets/sounds/synth-cut-tahdah.wav') },
  { id: '4', name: 'Electroids', path: require('@/assets/sounds/synth-electroids.wav') },
  { id: '5', name: 'Foggy', path: require('@/assets/sounds/synth-foggy.wav') },
  { id: '6', name: 'Gentle', path: require('@/assets/sounds/synth-gentle.wav') },
  { id: '7', name: 'Low Stringy', path: require('@/assets/sounds/synth-low-stringy.wav') },
  { id: '8', name: 'Soft Mystery', path: require('@/assets/sounds/synth-soft-mystery.wav') },
  { id: '9', name: 'Sunset', path: require('@/assets/sounds/synth-sunset.wav') },
];

const AudioSelector: React.FC<AudioSelectorProps> = ({
  onAudioSelected,
  initialAudios = [],
  maxItems = 10,
  preset = true
}) => {
  // Rest of component implementation...
  // (Keep the entire implementation from before, just update the imports)
  const [selectedAudios, setSelectedAudios] = useState<AudioItem[]>(initialAudios);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string | null>(null);
  const [usePresetAudio, setUsePresetAudio] = useState<boolean>(preset);

  // Clean up sound when component unmounts
  useEffect(() => {
    return sound
      ? () => {
          console.log("Unloading Sound");
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  // Update parent component when selected audios change
  useEffect(() => {
    onAudioSelected(selectedAudios);
  }, [selectedAudios, onAudioSelected]);

  const playSound = async (item: AudioItem) => {
    try {
      // Stop any currently playing sound
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
        setCurrentlyPlayingId(null);
      }

      console.log(`Attempting to load audio: ${item.name}, isPreset: ${item.isPreset}`);

      if (item.isPreset) {
        // For preset audio
        try {
          const { sound: newSound } = await Audio.Sound.createAsync(
            item.path,
            { shouldPlay: false }
          );

          // Check if sound loaded properly
          const status = await newSound.getStatusAsync();
          console.log("Sound status:", status);

          if (!status.isLoaded) {
            Alert.alert('Error', 'Sound failed to load properly');
            return;
          }

          // Set up listener for playback end
          newSound.setOnPlaybackStatusUpdate((status) => {
            if (status.didJustFinish) {
              setCurrentlyPlayingId(null);
            }
          });

          // Play the sound
          await newSound.playAsync();
          setSound(newSound);
          setCurrentlyPlayingId(item.id);
        } catch (error) {
          console.error('Error loading preset sound:', error);
          Alert.alert('Error', `Failed to load audio: ${error.message}`);
        }
      } else {
        // For uploaded audio
        try {
          const { sound: newSound } = await Audio.Sound.createAsync(
            { uri: item.uri },
            { shouldPlay: false }
          );

          // Check if sound loaded properly
          const status = await newSound.getStatusAsync();
          if (!status.isLoaded) {
            Alert.alert('Error', 'Sound failed to load properly');
            return;
          }

          // Set up listener for playback end
          newSound.setOnPlaybackStatusUpdate((status) => {
            if (status.didJustFinish) {
              setCurrentlyPlayingId(null);
            }
          });

          // Play the sound
          await newSound.playAsync();
          setSound(newSound);
          setCurrentlyPlayingId(item.id);
        } catch (error) {
          console.error('Error loading uploaded sound:', error);
          Alert.alert('Error', `Failed to load audio: ${error.message}`);
        }
      }
    } catch (error) {
      console.error('Error playing sound:', error);
      Alert.alert('Error', `Failed to play audio: ${error.message}`);
    }
  };

  const handleAudioSelect = (item: AudioItem) => {
    // If already selected, remove it
    if (selectedAudios.some(audio => audio.id === item.id)) {
      setSelectedAudios(prevSelected =>
        prevSelected.filter(audio => audio.id !== item.id)
      );
    } else {
      // Add it if we have less than maxItems
      if (selectedAudios.length < maxItems) {
        setSelectedAudios(prevSelected => [...prevSelected, item]);
      } else {
        Alert.alert('Limit Reached', `You can select a maximum of ${maxItems} audio clips`);
      }
    }
  };

  const uploadAudio = async () => {
    try {
      if (selectedAudios.length >= maxItems) {
        Alert.alert('Limit Reached', `You can select a maximum of ${maxItems} audio clips`);
        return;
      }

      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
        copyToCacheDirectory: true,
      });

      if (result.assets && result.assets.length > 0) {
        const asset = result.assets[0];

        // Check file size (4 seconds at ~192kbps is roughly 96KB)
        if (asset.size > 200000) { // 200KB as a safe limit
          Alert.alert('File Too Large', 'Please select audio clips under 4 seconds');
          return;
        }

        // Create a temporary unique ID
        const newAudio: AudioItem = {
          id: `upload-${Date.now()}`,
          name: asset.name,
          uri: asset.uri,
          isPreset: false,
          pitch: 0 // Will be analyzed later
        };

        setSelectedAudios(prev => [...prev, newAudio]);
      }
    } catch (error) {
      console.error('Error picking audio:', error);
      Alert.alert('Error', 'Failed to upload audio');
    }
  };

  const removeAudio = (id: string) => {
    setSelectedAudios(prev => prev.filter(audio => audio.id !== id));
    if (currentlyPlayingId === id) {
      if (sound) {
        sound.stopAsync();
        sound.unloadAsync();
        setSound(null);
      }
      setCurrentlyPlayingId(null);
    }
  };

  return (
    <View className="bg-white rounded-lg w-full">
      <Text className="mt-4 font-bold text-xl text-darkPurple">Choose audio source:</Text>

      {/* Audio Source Selection */}
      <View className="mt-4 bg-medYellow w-full py-6 rounded-3xl items-center">
        <View className="flex-row justify-center w-full px-4 space-x-6">
          <TouchableOpacity
            onPress={() => setUsePresetAudio(true)}
            className={`py-3 px-5 rounded-3xl ${usePresetAudio ? 'bg-darkPurple' : 'bg-lightPurple'}`}
          >
            <Text className="text-white font-medium text-center">Use Preset Audio</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setUsePresetAudio(false)}
            className={`py-3 px-5 rounded-3xl ${!usePresetAudio ? 'bg-darkPurple' : 'bg-lightPurple'}`}
          >
            <Text className="text-white font-medium text-center">Upload My Audio</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Preset Audio Section */}
      {usePresetAudio && (
        <View>
          <Text className="mt-4 font-bold text-xl text-darkPurple">Select preset sounds:</Text>
          <Text className="text-sm text-gray-500 mb-2">
            Select at least 3 sounds (max {maxItems})
          </Text>

          <View className="mt-2 bg-medYellow w-full py-3 rounded-3xl">
            <ScrollView>
              {PRESET_AUDIO.map((audio) => {
                const isSelected = selectedAudios.some(item => item.id === audio.id);
                return (
                  <View key={audio.id} className="flex-row items-center justify-between px-4 py-2 border-b border-lightYellow">
                    <TouchableOpacity
                      onPress={() => handleAudioSelect({
                        id: audio.id,
                        name: audio.name,
                        path: audio.path,
                        isPreset: true
                      })}
                      className="flex-row items-center flex-1"
                    >
                      <View
                        className={`w-4 h-4 rounded-full mr-3 ${isSelected ? 'bg-darkPurple' : 'bg-lightPurple'}`}
                      />
                      <Text className={`${isSelected ? 'font-bold' : 'font-medium'} text-darkPurple`}>
                        {audio.name}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => playSound({
                        id: audio.id,
                        name: audio.name,
                        path: audio.path,
                        isPreset: true
                      })}
                      className={`w-10 h-10 rounded-full justify-center items-center ${
                        currentlyPlayingId === audio.id ? 'bg-red-500' : 'bg-lightPurple'
                      }`}
                    >
                      <Image
                        source={icons.play}
                        resizeMode="contain"
                        tintColor="white"
                        className="w-5 h-5"
                        style={{
                          marginLeft: currentlyPlayingId === audio.id ? 0 : 2
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </View>
      )}

      {/* Upload Audio Section */}
      {!usePresetAudio && (
        <View>
          <Text className="mt-4 font-bold text-xl text-darkPurple">Upload your sounds:</Text>
          <Text className="text-sm text-gray-500 mb-2">
            Upload 3-{maxItems} sound files (max 4 seconds each)
          </Text>

          <View className="mt-2 bg-medYellow w-full py-3 rounded-3xl items-center">
            <TouchableOpacity
              onPress={uploadAudio}
              className="bg-lightPurple py-2 px-4 rounded-xl"
            >
              <Text className="text-white font-medium">Upload Audio File</Text>
            </TouchableOpacity>

            <View className="mt-4 w-full px-4">
              <Text className="font-bold mb-2">Uploaded Files ({selectedAudios.filter(a => !a.isPreset).length}/{maxItems}):</Text>

              {selectedAudios.filter(audio => !audio.isPreset).length > 0 ? (
                <View className="bg-white rounded-xl overflow-hidden">
                  {selectedAudios.filter(audio => !audio.isPreset).map((audio) => (
                    <View key={audio.id} className="flex-row items-center justify-between px-4 py-3 border-b border-lightYellow">
                      <View className="flex-row items-center flex-1">
                        <View className="w-4 h-4 rounded-full mr-3 bg-lightPurple" />
                        <Text className="text-darkPurple font-medium" numberOfLines={1} ellipsizeMode="middle">
                          {audio.name}
                        </Text>
                      </View>

                      <View className="flex-row items-center">
                        <TouchableOpacity
                          onPress={() => playSound(audio)}
                          className={`w-10 h-10 rounded-full justify-center items-center mr-2 ${
                            currentlyPlayingId === audio.id ? 'bg-red-500' : 'bg-lightPurple'
                          }`}
                        >
                          <Image
                            source={icons.play}
                            resizeMode="contain"
                            tintColor="white"
                            className="w-5 h-5"
                            style={{
                              marginLeft: currentlyPlayingId === audio.id ? 0 : 2
                            }}
                          />
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() => removeAudio(audio.id)}
                          className="w-10 h-10 rounded-full bg-red-500 justify-center items-center"
                        >
                          <Image
                            source={icons.trash}
                            resizeMode="contain"
                            tintColor="white"
                            className="w-5 h-5"
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              ) : (
                <Text className="text-gray-500 italic">No files uploaded yet</Text>
              )}
            </View>
          </View>
        </View>
      )}

      {/* Selected Audio Preview */}
      <Text className="mt-4 font-bold text-xl text-darkPurple">
        Selected audio ({selectedAudios.length}/{maxItems}):
      </Text>
      <View className="mt-2 bg-medYellow w-full py-3 rounded-3xl">
        {selectedAudios.length > 0 ? (
          <View className="px-4">
            {selectedAudios.map((audio) => (
              <View key={audio.id} className="flex-row items-center justify-between mb-2">
                <View className="flex-row items-center flex-1">
                  <View
                    className={`w-3 h-3 rounded-full mr-2 ${
                      audio.isPreset ? 'bg-darkPurple' : 'bg-lightPurple'
                    }`}
                  />
                  <Text className="text-darkMauve flex-1">{audio.name}</Text>
                </View>

                <TouchableOpacity
                  onPress={() => removeAudio(audio.id)}
                  className="w-8 h-8 rounded-full bg-red-400 justify-center items-center ml-2"
                >
                  <Text className="text-white text-xs">✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ) : (
          <Text className="text-gray-500 italic text-center">No audio selected</Text>
        )}
      </View>
    </View>
  );
};

export default AudioSelector;