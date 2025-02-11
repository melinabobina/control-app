import { View, Text, SafeAreaView, ScrollView } from 'react-native'
import React from 'react'
import Header from '@/components/Header';


const RecordArchive = () => {
  return (
    <SafeAreaView className="bg-white h-full">  
    <ScrollView contentContainerStyle={{height: '100%'}}>
      <View className="items-center w-full justify-center">
        <Header 
          title="Recording archive"
          header="Select your recording below"
        />

        
      </View>
    </ScrollView>
  </SafeAreaView>
  )
}

export default RecordArchive