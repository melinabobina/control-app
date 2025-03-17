import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import Header from '@/components/Header';
import { icons } from '@/constants';
import { router, useLocalSearchParams } from 'expo-router';
import { supabase } from '@/lib/supabase';

const ChooseConfigOrEdit = () => {
    const params = useLocalSearchParams();
    const configId = params.configId;
    const [title, setTitle] = useState('Configuration');
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
      const fetchConfigDetails = async () => {
        if (!configId) return;
        
        try {
          setIsLoading(true);
          
          const { data, error } = await supabase
            .from('configs')
            .select('config_name')
            .eq('id', configId)
            .single();
          
          if (error) {
            console.error('Error fetching configuration:', error);
            return;
          }
          
          if (data && data.config_name) {
            setTitle(data.config_name);
          }
        } catch (error) {
          console.error('Exception fetching configuration:', error);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchConfigDetails();
    }, [configId]);
    
    const handleBack = () => {
        router.back();
    };
    
    const handleEdit = () => {
        router.push({
          pathname: "/create-config",
          params: { configId }
        });
    };
    
    const handlePlay = () => {
        router.push({
          pathname: "/play-config",
          params: { configId }
        });
    };
      
    return (
        <SafeAreaView className="bg-white h-full">  
          <ScrollView contentContainerStyle={{flexGrow: 1, paddingBottom: 20}}>
            <View className="items-center w-full justify-center">
                <View className="w-full px-4 mt-2">
                    <TouchableOpacity 
                    onPress={handleBack}
                    className="flex-row items-center bg-lightPurple px-2 py-1 w-20 rounded-xl"
                    >
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
                    title={isLoading ? "Loading..." : title}
                    header={"Select or edit your configuration"}
                />

                <View className="items-center w-full justify-center h-[60vh]">
                    <TouchableOpacity 
                        className="bg-darkPurple rounded-3xl py-12 px-28 mt-6 w-3/4 items-center"
                        onPress={handleEdit}
                    >
                        <Text className="text-white font-bold text-lg">Edit {isLoading ? "Configuration" : title}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        className="bg-lightPurple rounded-3xl py-12 px-28 mt-6 w-3/4 items-center"
                        onPress={handlePlay}
                    >
                        <Text className="text-white font-bold text-lg">Play {isLoading ? "Configuration" : title}</Text>
                    </TouchableOpacity>
                </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      );
}

export default ChooseConfigOrEdit