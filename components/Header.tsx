import { View, Text, Image } from 'react-native'
import React from 'react'
import { icons } from '../constants'

const Header = ({ title, header }) => {
  return (
    <View className="pt-5 items-center justify-center w-full px-4">
      <View className="flex-row justify-between w-full px-5">
        <Image
          source={icons.tabMenu}
          resizeMode="contain"
          className="w-8 h-8"
        />

        <View className="w-10 h-10 bg-darkPurple rounded-full items-center justify-center">
          <Image
            source={icons.profile}
            resizeMode="contain"
            className="w-4 h-4 tint-white"
          />
        </View>
      </View>

      <Text className="text-medPurple text-2xl font-bold mt-2">{title}</Text>
      <Text className="text-medPurple">{header}</Text>
    </View>
  )
}

export default Header