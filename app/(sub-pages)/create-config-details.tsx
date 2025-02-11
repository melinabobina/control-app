import { View, Text, SafeAreaView, ScrollView } from 'react-native'
import React, { useState } from 'react'
import Header from '@/components/Header';
import SignalButton from '@/components/SignalButton';


const CreateConfig2 = () => {
  const [selectedSignal, setSelectedSignal] = useState("Alpha (8 - 12 Hz)")

  return (
    <SafeAreaView className="bg-white h-full">  
    <ScrollView contentContainerStyle={{height: '100%'}}>
      <View className="items-center w-full justify-center">
        <Header 
          title="Create a new configuration"
          header="Add and edit new ranges below"
        />

        <Text className="mt-4 font-bold text-xl self-start ml-7 text-darkPurple">Choose a signal:</Text>
        <View className="mt-4 bg-medYellow w-11/12 py-3 rounded-3xl flex-wrap flex-row justify-center items-center">
          {["Alpha (8 - 12 Hz)", "Beta (12 - 30 Hz)", "Gamma (30 - 50 Hz)", 
            "Theta (4 - 8 Hz)", "Delta (<4 Hz)"].map((signal, index) => (
            <View key={signal} className={`w-1/2 mt-5 ${index === 4 ? "w-full flex items-center" : "justify-center items-center"}`}>
              <SignalButton 
                title={signal}
                isSelected={selectedSignal === signal}
                onPress={() => setSelectedSignal(signal)}
              />
            </View>
          ))}
        </View>

        <Text className="mt-4 font-bold text-xl self-start ml-7 text-darkPurple">Specify a range:</Text>
          <View className="mt-4 bg-medYellow w-11/12 h-48 py-3 rounded-3xl items-center">
            <Text className="text-darkPurple px-14 pb-2 text-center font-medium mt-4">
              {selectedSignal}
            </Text>
          </View>

        
      </View>
    </ScrollView>
  </SafeAreaView>
  )
}

export default CreateConfig2