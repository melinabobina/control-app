import { StyleSheet, Text, View } from 'react-native'
import { Slot, Stack } from 'expo-router';
import { Link } from 'expo-router';
import React from 'react'

export default function App() {
  return (
    <View className="bg-black">  
      <Text className="text-bold font-pblack">Hello World!</Text>
      <Link href="/profile" >Go to Profile</Link>
    </View>
  )
}