import { View, Text, SafeAreaView, ScrollView } from 'react-native'
import React from 'react'
import Header from '@/components/Header';


const ChooseConfig = () => {
  return (
    <SafeAreaView className="bg-white h-full">  
    <ScrollView contentContainerStyle={{flexGrow: 1, paddingBottom: 20}}>
      <View className="items-center w-full justify-center">
        <Header 
          title="Choose your configuration"
          header="Select or edit a configuration below"
        />

        
      </View>
    </ScrollView>
  </SafeAreaView>
  )
}

export default ChooseConfig