import { View, Text, TouchableOpacity, Image, Alert } from 'react-native'
import { icons } from '../constants'
import React from 'react'

// Utility: check if a color is light
const isColorLight = (hex) => {
  if (!hex || hex.length !== 7 || hex[0] !== '#') return false;
  const r = parseInt(hex.substr(1, 2), 16);
  const g = parseInt(hex.substr(3, 2), 16);
  const b = parseInt(hex.substr(5, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 186;
};

// Utility: darken a hex color slightly
const darkenHexColor = (hex, amount = 20) => {
  if (!hex || hex.length !== 7 || hex[0] !== '#') return hex;
  const clamp = (val) => Math.max(0, Math.min(255, val));
  const r = clamp(parseInt(hex.substr(1, 2), 16) - amount);
  const g = clamp(parseInt(hex.substr(3, 2), 16) - amount);
  const b = clamp(parseInt(hex.substr(5, 2), 16) - amount);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

const ConfigRange = ({ id, signal, lower_range, upper_range, color, onDelete, onPress }) => {
  const handlePress = () => {
    if (onPress) onPress();
  };

  const handleDeletePress = () => {
    Alert.alert(
      "Confirm Deletion",
      `Are you sure you want to delete ${signal}?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Yes", 
          onPress: () => {
            console.log('Confirmed delete for ID:', id);
            if (onDelete) onDelete();
          },
          style: "destructive"
        }
      ]
    );
  };

  const waveType = signal.match(/^[A-Za-z]+/)?.[0] || signal;
  const displayText = `${waveType} (${lower_range}-${upper_range}) Hz`;

  const backgroundColor = color || '#47313E';
  const borderColor = darkenHexColor(backgroundColor, 30);
  const textColor = isColorLight(backgroundColor) ? '#000000' : '#FFFFFF';

  return (
    <View className="pt-3 px-8">
      <TouchableOpacity 
        style={{
          backgroundColor,
          borderColor,
          borderWidth: 1
        }}
        className="py-5 px-5 rounded-2xl"
        onPress={handlePress}
      >
        <View className="flex-row items-center justify-between w-full">
          <Text 
            style={{ color: textColor }}
            className="font-bold flex-1 text-center"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {displayText}
          </Text>
          <TouchableOpacity 
            className="pl-2 pr-3" 
            onPress={handleDeletePress}
            activeOpacity={0.7}
          >
            <Image
              source={icons.trash}
              resizeMode="contain"
              tintColor={textColor}
              className="w-6 h-6"
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ConfigRange;
