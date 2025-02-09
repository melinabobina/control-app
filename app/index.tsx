import {ScrollView, Text, View } from 'react-native'
import React from 'react'
import { Redirect, router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import HomepageButton from '@/components/HomeButton';
import HeaderText from '@/components/HeaderText';
import {icons} from '../constants'


export default function App() {
  return (
    <SafeAreaView className="bg-white h-full">  
      <ScrollView contentContainerStyle={{height: '100%'}}>
        <View className="items-center">
          <HeaderText 
            title="Neural Kinetic Sculpture"
            header="Select your choice below"
          />

          <HomepageButton 
            title="Create new configuration"
            handlePress={() => router.push('./create-config')}
            containerStyles="w-full mt-7" textStyles={undefined} 
            isLoading={undefined} 
            icon={icons.plus}
            />

          <HomepageButton 
            title="Create new configuration"
            handlePress={() => router.push('./create-config')}
            containerStyles="w-full mt-7" textStyles={undefined} 
            isLoading={undefined} 
            icon={icons.plus}
            />

          <HomepageButton 
            title="Create new configuration"
            handlePress={() => router.push('./create-config')}
            containerStyles="w-full mt-7" textStyles={undefined} 
            isLoading={undefined} 
            icon={icons.plus}
            />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}