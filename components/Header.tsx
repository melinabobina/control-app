import { View, Text } from 'react-native'
import React from 'react'

const Header = ({title, header}) => {
  return (
    <View className="pt-5 items-center justify center">
      <Text className="text-medPurple text-2xl font-bold">{title}</Text>
      <Text className="text-medPurple">{header}</Text>
    </View>
  )
}

export default Header