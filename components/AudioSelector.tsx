import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Audio } from 'expo-av';

interface AudioSelectorProps {
  onAudioSelected?: (uri: string, name: string) => void;
  selectedAudioName?: string;
  selectedAudioUri?: string;
  maxDuration?: number; // in milliseconds
}

const AudioSelector: React.FC<AudioSelectorProps> = ({
  onAudioSelected,
  selectedAudioName = "Default Audio",
  selectedAudioUri,
  maxDuration = 4000 // Default 4 seconds
}) => {
  // State to store the sound object
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  // State to track whether audio is currently playing
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // State to store the name of the current audio file
  const [audioName, setAudioName] = useState<string>(selectedAudioName);

  // State to track if we're using the default audio
  const [usingDefaultAudio, setUsingDefaultAudio] = useState<boolean>(!selectedAudioUri);

  // State to track audio URI
  const [audioUri, setAudioUri] = useState<string | undefined>(selectedAudioUri);

  // Cleanup effect - unload sound when component unmounts
  useEffect(() => {
    return sound
      ? () => {
          console.log("Unloading Sound");
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  // Function to play the default audio
  const playDefaultAudio = async (): Promise<void> => {
    try {
      // Unload any existing sound
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
      }

      // Create a new sound object from the default audio file
      const { sound: newSound } = await Audio.Sound.createAsync(
        require('../assets/sounds/default-audio.mp3') // Change this to your default audio path
      );

      // Store the new sound object and update UI state
      setSound(newSound);
      setAudioName("Default Audio");
      setAudioUri(undefined);
      setUsingDefaultAudio(true);

      // Start playing and update the isPlaying state
      await newSound.playAsync();
      setIsPlaying(true);

      // Listen for playback status updates to detect when audio ends
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setIsPlaying(false);
        }
      });

      // If callback provided
      if (onAudioSelected) {
        onAudioSelected("default", "Default Audio");
      }
    } catch (error) {
      console.error('Error playing default audio:', error);
    }
  };

  // Function to handle play/pause toggle
  const handlePlayPause = async (): Promise<void> => {
    if (sound) {
      // If we have a sound object loaded
      if (isPlaying) {
        // If it's playing, pause it
        await sound.pauseAsync();
        setIsPlaying(false);
      } else {
        // If it's paused, play it
        await sound.playAsync();
        setIsPlaying(true);
      }
    } else if (audioUri) {
      // If we have a URI but no sound object, create and play it
      try {
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: audioUri },
          { shouldPlay: true }
        );

        setSound(newSound);
        setIsPlaying(true);

        newSound.setOnPlaybackStatusUpdate((status) => {
          if (status.didJustFinish) {
            setIsPlaying(false);
          }
        });
      } catch (error) {
        console.error('Error playing audio from URI:', error);
      }
    } else {
      // If no sound is loaded, play the default audio
      await playDefaultAudio();
    }
  };

  // Function to handle custom audio upload
  const uploadAudio = async (): Promise<void> => {
    try {
      // Open document picker limited to audio files
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
        copyToCacheDirectory: true,
      });

      // Check if a file was selected
      if (result.assets && result.assets.length > 0) {
        // Unload previous sound if exists
        if (sound) {
          await sound.stopAsync();
          await sound.unloadAsync();
          setSound(null);
          setIsPlaying(false);
        }

        const asset = result.assets[0];

        // Check file size (approximate way to limit duration)
        // A more accurate way would be to actually load and check the audio
        // but this provides a quick check
        if (asset.size > (maxDuration / 1000) * 50000) { // Rough estimate: 50KB per second
          alert(`Audio file is too large. Please select a clip under ${maxDuration / 1000} seconds.`);
          return;
        }

        // Create a new sound object from the selected file
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: asset.uri },
          { shouldPlay: false }
        );

        // Load the sound to get its status
        const status = await newSound.getStatusAsync();

        // Check the actual duration if available
        if (status.isLoaded && status.durationMillis && status.durationMillis > maxDuration) {
          await newSound.unloadAsync();
          alert(`Audio clip is too long. Please select a clip under ${maxDuration / 1000} seconds.`);
          return;
        }

        // Update state with the new sound and file info
        setSound(newSound);
        setAudioName(asset.name);
        setAudioUri(asset.uri);
        setUsingDefaultAudio(false);

        // Call the callback if provided
        if (onAudioSelected) {
          onAudioSelected(asset.uri, asset.name);
        }
      }
    } catch (error) {
      console.error('Error picking audio:', error);
    }
  };

  // Render the component UI
  return (
    <View className="bg-white p-4 rounded-lg shadow-md w-full mb-4">
      <Text className="text-xl font-bold text-medMauve mb-2">Audio Configuration</Text>
      
      {/* Display current audio name and play/pause button */}
      <View className="flex-row items-center mb-4">
        <Text className="text-darkMauve flex-1">{audioName}</Text>
        <TouchableOpacity
          activeOpacity={0.7}
          className={`px-4 py-2 rounded-lg ${isPlaying ? 'bg-red-500' : 'bg-lightYellow'}`}
          onPress={handlePlayPause}
        >
          <Text className="text-darkMauve font-medium">
            {isPlaying ? 'Pause' : 'Play'}
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Audio source selection buttons */}
      <View className="flex-row justify-between">
        <TouchableOpacity
          activeOpacity={0.7}
          className={`px-4 py-2 rounded-lg ${usingDefaultAudio ? 'bg-darkYellow' : 'bg-lightYellow'}`}
          onPress={playDefaultAudio}
        >
          <Text className="text-darkMauve font-medium">Use Default Audio</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          activeOpacity={0.7}
          className="bg-lightYellow px-4 py-2 rounded-lg"
          onPress={uploadAudio}
        >
          <Text className="text-darkMauve font-medium">Upload Audio</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AudioSelector;
