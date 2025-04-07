import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, Dimensions, Alert } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import Header from '@/components/Header';
import { icons } from '@/constants';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { supabase } from '@/lib/supabase';
import ConfigPlay from '@/components/ConfigPlay';
import ConfigDetails from '@/components/ConfigDetails';
import StartButton from '@/components/StartButton';

const PlayConfig = () => {
    const { configId } = useLocalSearchParams();
    const [fetchError, setFetchError] = useState('');
    const [data, setData] = useState(null);
    const [configData, setConfigData] = useState(null);

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [])
    );
    
    const fetchData = async () => {
        try {
            const { data: userData, error: userError } = await supabase.auth.getUser();
            if (userError) throw userError;
        
            const userId = userData?.user?.id;      
            if (!userId) throw new Error("User ID not found");
        
            const { data: settingsData, error: settingsError } = await supabase
                .from('config_settings')
                .select('*') 
                .eq('config_id', configId);
        
            if (settingsError) {
                setFetchError('Could not fetch the config settings');
                setData([]);
                console.log("Supabase query error:", settingsError);
                return;
            }
        
            const { data: configTableData, error: configError } = await supabase
                .from('configs')
                .select('*') 
                .eq('id', configId)
                .single();
        
            if (configError) {
                setFetchError('Could not fetch the config data');
                setConfigData(null);
                console.log("Supabase query error:", configError);
                return;
            }
        
            setData(settingsData); 
            setConfigData(configTableData);
            setFetchError('');
        } catch (err) {
            console.error('Error fetching configurations:', err);
            setFetchError('An unexpected error occurred');
        }
    };

    const handleBack = () => {
        router.back();
    };

    return (
        <SafeAreaView className="bg-white h-full">  
            <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}>
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

                    <StartButton/>

                    {fetchError && (<Text className="text-red-500 mt-2">{fetchError}</Text>)}
                    {data && data.length > 0 ? (
                        <View className="flex-row flex-wrap justify-center w-full px-4">
                            {data.map(config => (
                                <View 
                                    key={config.id} 
                                    className="w-44"
                                >
                                    <ConfigPlay
                                        name={config.setting_name}
                                        color="slate-500"
                                    />
                                </View>
                            ))}
                        </View>
                    ) : (
                        <Text className="mt-2 text-gray-500 italic">No configs found. Add a config to get started.</Text>
                    )}   

                    {data && data.length > 0 ? (
                        <View className="items-center justify-center">
                            {data.map(config => (
                                <View 
                                    key={config.id} 
                                    className=""
                                >
                                <ConfigDetails
                                    name={config.setting_name}
                                    brightness={config.brightness}
                                    speed={config.speed}
                                    direction={config.direction}
                                    color={config.color}
                                    selectedPanels={config.selected_panels} 
                                    x={configData?.panels_x}
                                    y={configData?.panels_y}
                                />
                                </View>
                            ))}
                        </View>
                    ) : (
                        <Text className="mt-2 text-gray-500 italic">No configs being played right now.</Text>
                    )}  
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default PlayConfig;