import {ScrollView, View } from 'react-native'
import React from 'react'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import HomepageButton from '@/components/HomeButton';
import Header from '@/components/Header';
import {icons} from '../../constants'

const Home = () => {
  return (
    <SafeAreaView className="bg-white h-full">  
    <ScrollView contentContainerStyle={{flexGrow: 1, paddingBottom: 20}}>
      <View className="items-center justify-center">
        <Header 
          title="Neural Kinetic Sculpture"
          header="Select your choice below"
        />

        <HomepageButton 
          title="Create new configuration"
          handlePress={() => router.push('./create-config')}
          containerStyles="w-full mt-7" textStyles={undefined} 
          isLoading={undefined} 
          icon={icons.plus}
          background="bg-lightMauve"
          />

        <HomepageButton 
          title="Choose or edit an existing configuration"
          handlePress={() => router.push('./choose-config')}
          containerStyles="w-full mt-7" textStyles={undefined} 
          isLoading={undefined} 
          icon={icons.plus}
          background="bg-medMauve"
          />

        <HomepageButton 
          title="Check recording archives"
          handlePress={() => router.push('./record-archive')}
          containerStyles="w-full mt-7" textStyles={undefined} 
          isLoading={undefined} 
          icon={icons.plus}
          background="bg-darkMauve"
          />
      </View>
    </ScrollView>
  </SafeAreaView>
  )
}

export default Home