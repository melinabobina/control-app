import { StyleSheet, Text, View } from 'react-native'
import { Slot, Stack } from 'expo-router';
import { Link } from 'expo-router';
import React from 'react'

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-purple">  
      <Text className="text-bold font-pblack">Hello World!</Text>
      <Link href="/home" >Go to Home</Link>
    </View>
  )
}