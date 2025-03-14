import { View, Text, TouchableOpacity, Image, Alert } from 'react-native'
import { icons } from '../constants'
import React from 'react'
import { router } from 'expo-router'

const ConfigRange = ({ id, signal, lower_range, upper_range, color, onDelete, onPress }) => {
  const handlePress = () => {
    if (onPress) {
      onPress();
    }
  };

  const handleDeletePress = () => {
    Alert.alert(
      "Confirm Deletion",
      `Are you sure you want to delete ${signal} Hz)?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Yes", 
          onPress: () => {
            console.log('Confirmed delete for ID:', id);
            if (onDelete) {
              onDelete();
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  return (
    <View className="pt-3 px-8">
      <TouchableOpacity 
        style={{ backgroundColor: color || '#47313E' }} // Provide default color
        className="py-5 px-5 rounded-2xl"
        onPress={handlePress}
      >
        <View className="flex-row items-center justify-between w-full">
          <Text className="text-white font-bold flex-1 text-center" numberOfLines={1} ellipsizeMode="tail">
            {signal}
          </Text>
          <TouchableOpacity 
            className="pl-2 pr-3" 
            onPress={handleDeletePress}
            activeOpacity={0.7}
          >
            <Image
              source={icons.trash}
              resizeMode="contain"
              tintColor="white"
              className="w-6 h-6"
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ConfigRange;