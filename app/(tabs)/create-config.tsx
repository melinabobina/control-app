import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, Alert } from 'react-native'
import { useState, useEffect } from 'react'
import Header from '@/components/Header';
import { TextInput } from "@/components/TextInput";
import { router } from 'expo-router';
import { icons } from '@/constants';
import { useConfigStore } from '../../store';
import ConfigRange from '@/components/ConfigRange';
import { supabase } from '@/lib/supabase';

const CreateConfig = () => {
  const { x, y, name, height, setX, setY, setName, setHeight } = useConfigStore();
  const [isFormValid, setIsFormValid] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data, error } = await supabase
        .from('config_settings')
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
        .from('config_settings')
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
  useEffect(() => {
    const formIsValid = 
      name.trim() !== "" && 
      height.trim() !== "" && 
      x.trim() !== "" && 
      y.trim() !== "";
    
    setIsFormValid(formIsValid);
  }, [name, height, x, y]);

  const handleSavePress = () => {
    if (isFormValid) {
      router.push('/choose-config');
    } else {
      Alert.alert(
        "Missing Information",
        "Please fill out all required fields (name, starting height, and number of panels) before saving your configuration.",
        [{ text: "OK" }]
      );
    }
  };

  const handleAddRangePress = () => {
    if (isFormValid) {
      router.push('/(sub-pages)/create-config-details');
    } else {
      Alert.alert(
        "Missing Information",
        "Please fill out all required fields (name, starting height, and number of panels) before adding a range.",
        [{ text: "OK" }]
      );
    }
  };

  return (
    <SafeAreaView className="bg-white h-full">  
      <ScrollView contentContainerStyle={{flexGrow: 1, paddingBottom: 20}}>
        <View className="items-center w-full justify-center">
          <Header 
            title="Create a new configuration"
            header="Add and edit new ranges below"
          />

          <TouchableOpacity
            activeOpacity={isFormValid ? 0.7 : 1}
            className={`${isFormValid ? 'bg-darkPurple' : 'bg-gray-400'} w-96 items-center justify-center h-12 rounded-2xl mt-4`}
            onPress={handleSavePress}
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
              keyboardType="numeric"
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
              keyboardType="numeric"
            />
            <TextInput 
              value={y}
              onChangeText={setY}
              placeholder="Enter y here"
              keyboardType="numeric"
            />
          </View>

          <TouchableOpacity
            activeOpacity={isFormValid ? 0.7 : 1}
            className={`${isFormValid ? 'bg-lightPurple' : 'bg-gray-400'} w-96 items-center justify-center h-12 rounded-2xl mt-4`}
            onPress={handleAddRangePress}
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
        
          {fetchError && (<Text className="text-red-500 mt-2">{fetchError}</Text>)}
          {data && data.length > 0 ? (
            <View className="w-full">
              {data.map(config => (
                <ConfigRange
                  key={config.id}
                  id={config.id}
                  signal={config.selectedSignal || config.setting_name} 
                  lower_range={config.rangeValues_0 !== undefined ? config.rangeValues_0 : config.lower_range}
                  upper_range={config.rangeValues_1 !== undefined ? config.rangeValues_1 : config.upper_range}
                  color={config.selectedColor || config.color}
                  onDelete={() => {
                    handleDeleteConfig(config.id);
                  }}
                  onPress={() => {
                    router.push({
                      pathname: "/(sub-pages)/create-config-details",
                      params: { configId: config.id }
                    });
                  }}
                />
              ))}
            </View>
          ) : (
            <Text className="mt-2 text-gray-500 italic">No ranges found. Add a range to get started.</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateConfig;