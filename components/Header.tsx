import { View, Text, Image, TouchableOpacity, Button, Alert } from 'react-native'
import React, { useState } from 'react'
import { icons } from '../constants'
import Modal from 'react-native-modal'
import { supabase } from '../lib/supabase'
import { router } from 'expo-router'
import {images} from '../constants'

const Header = ({ title, header }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalVisible2, setModalVisible2] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const toggleModal2 = () => {
    setModalVisible2(!isModalVisible2);
  };

  const logOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()

      Alert.alert("Success", "User signed out successfully");
      router.replace("/");
    } catch (error) {
      Alert.alert("Error", "Logout unsuccessful, please try again");
    }
  };

  const navigateTo = (screen) => {
    setModalVisible2(false);
    router.push(screen);
  };

  return (
    <View className="pt-5 items-center justify-center w-full px-4">
      <View className="flex-row justify-between w-full px-5">
        <TouchableOpacity onPress={toggleModal2}>
          <Image
            source={icons.tabMenu}
            resizeMode="contain"
            className="w-8 h-8"
          />

        <Modal 
          isVisible={isModalVisible2}
          style={{ margin: 0 }} // Remove default margin
          animationIn="slideInLeft"
          animationOut="slideOutLeft"
          onBackdropPress={toggleModal2} // Close when clicking outside
          backdropOpacity={0.5} // Semi-transparent backdrop
          propagateSwipe={true} // Allow swiping within the modal
        >
          <View className="bg-white w-64 h-full absolute left-0 top-0 bottom-0 p-5">
            <View className="flex-col h-full justify-between">
              <View className="flex-1 ml-2">
                <Image
                  source={images.neural}
                  resizeMode="contain"
                  tintColor=""
                  className="w-full h-64"
                />

                <TouchableOpacity className="pb-3 flex-row items-center" onPress={() => navigateTo('/home')}>
                  <Image
                      source={icons.home}
                      tintColor="#6D3A41"
                      resizeMode="contain"
                      className="w-5 h-5"
                    />

                  <Text className="text-medMauve text-lg pl-3">Home</Text>
                </TouchableOpacity>
                <TouchableOpacity className="py-3 flex-row items-center" onPress={() => navigateTo('/create-config')}>
                  <Image
                        source={icons.plus}
                        tintColor="#6D3A41"
                        resizeMode="contain"
                        className="w-5 h-5"
                      />
                  <Text className="text-medMauve text-lg pl-3">Create</Text>
                </TouchableOpacity>
                <TouchableOpacity className="py-3 flex-row items-center" onPress={() => navigateTo('/choose-config')}>
                  <Image
                          source={icons.play}
                          tintColor="#6D3A41"
                          resizeMode="contain"
                          className="w-5 h-5"
                        />
                  <Text className="text-medMauve text-lg pl-3">Configs</Text>
                </TouchableOpacity>
                <TouchableOpacity className="py-3 flex-row items-center" onPress={() => navigateTo('/record-archive')}>
                  <Image
                          source={icons.bookmark}
                          tintColor="#6D3A41"
                          resizeMode="contain"
                          className="w-5 h-5"
                        />
                  <Text className="text-medMauve text-lg pl-3">Archive</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleModal}>
          <View className="w-10 h-10 bg-darkPurple rounded-full items-center justify-center">
              <Image
                source={icons.profile}
                resizeMode="contain"
                className="w-4 h-4 tint-white"
              />

            <Modal isVisible={isModalVisible} className="bg-white my-96 px-8 rounded-2xl">
              <View className="flex-col items-center mb-20 relative">
                <View className="absolute top-0 right-0 mt-10">
                  <TouchableOpacity onPress={toggleModal}>
                    <Text className="text-darkMauve text-xl">X</Text>
                  </TouchableOpacity>
                </View>

                <View className="w-full h-full flex items-center justify-center mt-10">
                  <TouchableOpacity onPress={logOut} className="bg-medMauve rounded-xl py-3 px-6">
                    <Text className="text-white text-center">Log out of your account</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
        </TouchableOpacity>
      </View>
    
      <Text className="text-medPurple text-2xl font-bold mt-2">{title}</Text>
      <Text className="text-medPurple">{header}</Text>
    </View>
  )
}

export default Header