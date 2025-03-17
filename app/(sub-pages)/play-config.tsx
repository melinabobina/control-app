import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import Header from '@/components/Header';
import { icons } from '@/constants';
import { router, useLocalSearchParams } from 'expo-router';
import { supabase } from '@/lib/supabase';

const PlayConfig = () => {
    const handleBack = () => {
    router.back();
    };

    return (
        <SafeAreaView className="bg-white h-full">  
          <ScrollView contentContainerStyle={{flexGrow: 1, paddingBottom: 20}}>
            <View className="items-center w-full justify-center">
                <View className="w-full px-4 mt-2">
                    <TouchableOpacity 
                        onPress={handleBack}
                        className="flex-row items-center bg-lightPurple px-2 py-1 w-20 rounded-xl">
                        <Image
                        source={icons.leftArrow}
                        resizeMode="contain"
                        tintColor="#47313E"
                        className="w-4 h-4"
                        />
                        <Text className="text-white ml-3">Back</Text>
                    </TouchableOpacity>
                </View>

                <Header 
                    title={"Play your configuration"}
                    header={"Enjoy the performance!"}
                />           
            </View>
          </ScrollView>
        </SafeAreaView>
      );
}

export default PlayConfig