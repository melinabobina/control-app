import { Text, TouchableOpacity, Image, View } from 'react-native';
import React from 'react';
import {icons} from '../constants'


const HomepageButton = ({ title, handlePress, containerStyles, textStyles, isLoading, icon, background}) => {
  return (
    <TouchableOpacity 
        onPress={handlePress}
        activeOpacity={0.7}
        className={`h-52 w-[340px] rounded-3xl ${background} ${containerStyles} ${isLoading ? 'opacity-50' : ''}`}
    >
      <View className="h-full">
        <View className="pl-8 pt-12">
          <Image
            source={icon}
            tintColor="#F4E8D0"
            resizeMode="contain"
            className="w-10 h-10"
          />
        </View>
        
        <View className="flex-row items-center justify-between pl-8 pr-8 pt-12">
          <Text className={`text-white text-xl font-bold  ${textStyles}`}>{title}</Text>
          <Image
            source={icons.rightArrow}
            tintColor="#F4E8D0"
            resizeMode="contain"
            className="w-5 h-5"
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default HomepageButton;
