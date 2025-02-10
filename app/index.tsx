import {ScrollView, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { Redirect, router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from '@/components/Header';
import {images} from '../constants'


export default function App() {
  return (
    <SafeAreaView className="bg-white h-full">  
      <ScrollView contentContainerStyle={{height: '100%'}}>
        <View className="items-center w-full justify-center h-[85vh]">
          <Header 
            title="Neural Kinetic Sculpture"
            header=""
          />

          <Image
            source={images.neural}
            resizeMode="contain"
            tintColor=""
            className="w-full h-80"
          />

          <Text className="font-bold text-2xl pt-5 text-medMauve">
            Configure your sculpture
          </Text>

          <Text className="text-lg text-medMauve pb-10">
            Begin by signing up or logging in below
          </Text>

          <TouchableOpacity
            activeOpacity={0.7}
            className="bg-lightYellow w-80 items-center justify-center h-12 rounded-lg"
            onPress={() => router.push('/sign-in')}
          >
            <Text className="text-darkMauve font-medium">
              Login
            </Text>
          </TouchableOpacity>

          <View className="pt-2">
            <TouchableOpacity
              activeOpacity={0.7}
              className="bg-darkYellow w-80 items-center justify-center h-12 rounded-lg"
              onPress={() => router.push('./home')}
            >
              <Text className="text-darkMauve font-medium">
                Sign up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}