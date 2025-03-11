import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image } from 'react-native'
import { useState } from 'react'
import Header from '@/components/Header';
import { TextInput } from "@/components/TextInput";
import { router } from 'expo-router';
import { icons } from '@/constants';
import { useConfigStore } from '../../store';


const CreateConfig = () => {
  const [name, setName] = useState("");
  const [height, setHeight] = useState("");
  const { x, y, setX, setY } = useConfigStore();

  return (
    <SafeAreaView className="bg-white h-full">  
    <ScrollView contentContainerStyle={{flexGrow: 1, paddingBottom: 20}}>
      <View className="items-center w-full justify-center">
        <Header 
          title="Create a new configuration"
          header="Add and edit new ranges below"
        />

<TouchableOpacity
          activeOpacity={0.7}
          className="bg-darkPurple w-96 items-center justify-center h-12 rounded-2xl mt-4"
          onPress={() => router.push('/choose-config')}
        >
          <View className="flex-row items-center justify-between w-full px-5">
            <View className="flex-1 items-center">
              <Text className="text-white font-medium">
                Save your configuration
              </Text>
            </View>
            <Image
              source={icons.bookmark}
              resizeMode="contain"
              tintColor="white"
              className="w-6 h-6"
            />
          </View>
        </TouchableOpacity>

        <Text className="mt-4 font-bold text-xl self-start ml-7 text-darkPurple">Name your configuration:</Text>
        <View className="mt-4 bg-medYellow w-11/12 h-24 py-3 rounded-3xl justify-center items-center">
          <TextInput 
            value={name}
            onChangeText={setName}
            placeholder="Enter name here"
          />
        </View>

        <Text className="mt-4 font-bold text-xl self-start ml-7 text-darkPurple">Enter a starting height:</Text>
        <View className="mt-4 bg-medYellow w-11/12 h-36 py-3 rounded-3xl justify-center items-center">
          <Text className="text-darkPurple px-8 pb-2 text-center font-medium">
            Enter, in meters, the distance from the ceiling you would like the sculpture to begin at:
          </Text>
          <TextInput 
            value={height}
            onChangeText={setHeight}
            placeholder="Enter height here"
          />
        </View>

        <Text className="mt-4 font-bold text-xl self-start ml-7 text-darkPurple">Enter number of panels:</Text>
        <View className="mt-4 bg-medYellow w-11/12 h-48 py-3 rounded-3xl justify-center items-center">
          <Text className="text-darkPurple px-14 pb-2 text-center font-medium">
            Enter the number of panels in the format X by Y, such as a 3x3 array.
          </Text>
          <TextInput 
            value={x}
            onChangeText={setX}
            placeholder="Enter x here"
          />
          <TextInput 
            value={y}
            onChangeText={setY}
            placeholder="Enter y here"
          />
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          className="bg-lightPurple w-96 items-center justify-center h-12 rounded-2xl mt-4"
          onPress={() => router.push('/(sub-pages)/create-config-details')}
        >
          <View className="flex-row items-center justify-between w-full px-5">
            <View className="flex-1 items-center">
              <Text className="text-white font-medium">
                Add a range
              </Text>
            </View>
            <Image
              source={icons.plus}
              resizeMode="contain"
              tintColor="white"
              className="w-6 h-6"
            />
          </View>
        </TouchableOpacity>

        <Text className="mt-4 font-bold text-xl self-start ml-7 text-darkPurple">Current ranges:</Text>

      </View>
    </ScrollView>
  </SafeAreaView>
  )
}

export default CreateConfig