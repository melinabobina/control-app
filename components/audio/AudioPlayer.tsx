import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Audio } from 'expo-av';
import { icons } from '@/constants'; // Updated path

interface AudioPlayerProps {
  audioItem: {
    id: string;
    name: string;
    uri?: string;
    path?: any;
    isPreset: boolean;
  };
  size?: 'small' | 'medium' | 'large';
  showName?: boolean;
  onPlaybackEnd?: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioItem,
  size = 'medium',
  showName = true,
  onPlaybackEnd
}) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);

  // Set up dimensions based on size prop
  const getDimensions = () => {
    switch(size) {
      case 'small':
        return { button: 'w-8 h-8', icon: 'w-3 h-3' };
      case 'large':
        return { button: 'w-14 h-14', icon: 'w-7 h-7' };
      case 'medium':
      default:
        return { button: 'w-10 h-10', icon: 'w-5 h-5' };
    }
  };

  const dimensions = getDimensions();

  // Clean up on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  // Function to load and play sound
  const loadSound = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Unload any existing sound first
      if (sound) {
        await sound.unloadAsync();
      }

      let newSound: Audio.Sound;

      if (audioItem.isPreset) {
        // For preset audio
        const { sound: presetSound } = await Audio.Sound.createAsync(
          audioItem.path,
          { shouldPlay: false }
        );
        newSound = presetSound;
      } else {
        // For uploaded audio
        const { sound: uploadedSound } = await Audio.Sound.createAsync(
          { uri: audioItem.uri },
          { shouldPlay: false }
        );
        newSound = uploadedSound;
      }

      // Check if component is still mounted
      if (!isMounted.current) {
        await newSound.unloadAsync();
        return;
      }

      // Set up event listener
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (!status.isLoaded) return;

        if (status.didJustFinish) {
          setIsPlaying(false);
          if (onPlaybackEnd) onPlaybackEnd();
        }
      });

      setSound(newSound);
      setIsLoading(false);

      // Auto-play
      await newSound.playAsync();
      setIsPlaying(true);
    } catch (err) {
      console.error('Error loading sound:', err);
      if (isMounted.current) {
        setError('Failed to load audio');
        setIsLoading(false);
      }
    }
  };

  const handlePlayPause = async () => {
    if (isLoading) return;

    try {
      if (!sound) {
        // If sound hasn't been loaded yet, load and play it
        await loadSound();
      } else {
        // Toggle play/pause of existing sound
        if (isPlaying) {
          await sound.pauseAsync();
          setIsPlaying(false);
        } else {
          await sound.playAsync();
          setIsPlaying(true);
        }
      }
    } catch (err) {
      console.error('Error handling play/pause:', err);
      setError('Error playing audio');
    }
  };

  return (
    <View className="flex-row items-center">
      {showName && (
        <Text
          className="text-darkPurple mr-2 flex-1"
          numberOfLines={1}
          ellipsizeMode="middle"
        >
          {audioItem.name}
        </Text>
      )}

      <TouchableOpacity
        onPress={handlePlayPause}
        disabled={isLoading}
        className={`${dimensions.button} rounded-full justify-center items-center ${
          isPlaying ? 'bg-red-500' : 'bg-lightPurple'
        }`}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Image
            source={isPlaying ? icons.pause : icons.play}
            resizeMode="contain"
            tintColor="white"
            className={dimensions.icon}
            style={{
              marginLeft: isPlaying ? 0 : 2 // Slight adjustment for play icon
            }}
          />
        )}
      </TouchableOpacity>

      {error && (
        <Text className="text-red-500 text-xs ml-2">
          {error}
        </Text>
      )}
    </View>
  );
};

export default AudioPlayer;