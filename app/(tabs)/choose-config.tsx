import { View, Text, SafeAreaView, ScrollView, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '@/components/Header';
import Config from '@/components/Config';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';


const ChooseConfig = () => {
  const [fetchError, setFetchError] = useState('');
  const [data, setData] = useState(null);

  useEffect(() => {
      fetchData();
    }, []);
  
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('configs')
          .select('*');
    
        if (error) {
          setFetchError('Could not fetch the data');
          setData(null);
          console.log(error);
          return;
        }
    
        if (data) {
          setData(data);
          setFetchError('');
        }
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
                date={new Intl.DateTimeFormat("en-US").format(new Date(config.created_at))}                favorite={config.favorite}
                onDelete={() => {
                  handleDeleteConfig(config.id);
                }}
                onPress={() => {
                  router.push({
                    pathname: "/create-config",
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