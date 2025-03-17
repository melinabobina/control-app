import { View, Text, SafeAreaView, ScrollView, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '@/components/Header';
import Config from '@/components/Config';
import { supabase } from '@/lib/supabase';
import { router, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

const ChooseConfig = () => {
  const [fetchError, setFetchError] = useState('');
  const [data, setData] = useState(null);

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
  
      const { data, error } = await supabase
        .from('configs')
        .select('*') 
        .eq('user_id', userId);
    
      if (error) {
        setFetchError('Could not fetch the data');
        setData([]);
        console.log("Supabase query error:", error);
        return;
      }
  
      setData(data || []); 
      setFetchError('');
    } catch (err) {
      console.error('Error fetching configurations:', err);
      setFetchError('An unexpected error occurred');
    }
  };
  

  const handleDeleteConfig = async (id) => {
    try {      
      if (!id) {
        throw new Error('No ID provided');
      }
      
      const { error } = await supabase
        .from('configs')
        .delete()
        .eq('id', id);
  
      if (error) {
        throw error;
      }

      fetchData();
      Alert.alert("Success", "Configuration deleted successfully");
    } catch (error) {
      console.error('Error deleting configuration:', error);
      Alert.alert("Error", "Failed to delete configuration: " + error.message);
    }
  };

  const handleFavoriteChange = async (id, newStatus) => {
    await fetchData();
  };
      
  return (
    <SafeAreaView className="bg-white h-full">  
      <ScrollView contentContainerStyle={{flexGrow: 1, paddingBottom: 20}}>
        <View className="items-center w-full justify-center">
          <Header 
            title="Choose your configuration"
            header="Select or edit a configuration below"
          />

          {fetchError && (<Text className="text-red-500 mt-2">{fetchError}</Text>)}
          {data && data.length > 0 ? (
            <View className="">
              {data.map(config => (
                <Config
                  key={config.id}
                  id={config.id}
                  name={config.config_name}
                  date={new Intl.DateTimeFormat("en-US").format(new Date(config.created_at))}
                  favorite={config.favorite}
                  onDelete={() => handleDeleteConfig(config.id)}
                  onFavoriteChange={handleFavoriteChange}
                  onPress={() => {
                    router.push({
                      pathname: "/(sub-pages)/choose-config-or-edit",
                      params: { configId: config.id }
                    });
                  }}
                />
              ))}
            </View>
          ) : (
            <Text className="mt-2 text-gray-500 italic">No configs found. Add a config to get started.</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default ChooseConfig