import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
} from 'react-native-reanimated';

interface AudioVisualizationProps {
  isPlaying: boolean;
  color?: string;
  barsCount?: number;
  spacing?: number;
  minHeight?: number;
  maxHeight?: number;
}

const AudioVisualization: React.FC<AudioVisualizationProps> = ({
  isPlaying,
  color = '#47313E', // Default to darkPurple
  barsCount = 5,
  spacing = 4,
  minHeight = 8,
  maxHeight = 24,
}) => {
  // Array to hold animation values for each bar
  const [animationValues, setAnimationValues] = useState<Animated.SharedValue<number>[]>([]);

  // Initialize animation values
  useEffect(() => {
    const values = Array(barsCount)
      .fill(0)
      .map(() => useSharedValue(minHeight));
    setAnimationValues(values);
  }, [barsCount]);

  // Handle animation based on playing state
  useEffect(() => {
    if (!animationValues.length) return;

    if (isPlaying) {
      // Start animations with random durations for natural effect
      animationValues.forEach((value, index) => {
        const duration = 500 + Math.random() * 500; // 500-1000ms
        value.value = withRepeat(
          withTiming(
            minHeight + Math.random() * (maxHeight - minHeight),
            {
              duration,
              easing: Easing.inOut(Easing.ease)
            }
          ),
          -1, // Infinite repeat
          true // Reverse
        );
      });
    } else {
      // Reset to minHeight when stopped
      animationValues.forEach((value) => {
        value.value = withTiming(minHeight, { duration: 300 });
      });
    }

    // Clean up animations
    return () => {
      animationValues.forEach((value) => {
        value.value = minHeight;
      });
    };
  }, [isPlaying, animationValues]);

  // Create animated bar components
  const renderBars = () => {
    return animationValues.map((value, index) => {
      const animatedStyle = useAnimatedStyle(() => {
        return {
          height: value.value,
        };
      });

      return (
        <Animated.View
          key={index}
          style={[
            {
              width: 3,
              backgroundColor: color,
              borderRadius: 3,
              marginHorizontal: spacing / 2,
            },
            animatedStyle,
          ]}
        />
      );
    });
  };

  return (
    <View className="flex-row items-center justify-center h-8">
      {animationValues.length > 0 && renderBars()}
    </View>
  );
};

export default AudioVisualization;