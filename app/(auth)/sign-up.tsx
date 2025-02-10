import { View, Text, ScrollView, Image } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../constants'
import FormField from '../../components/FormField'
import LoginButton from '../../components/LoginButton'
import { Link } from 'expo-router'

const SignUp = () => {
  const [form, setForm] = useState({
    email: '',
    password: ''
  })

  const [isSubmitting, setSubmitting] = useState(false)

  const submit = async () => {
    // if (form.email === "" || form.password === "") {
    //   Alert.alert("Error", "Please fill in all fields");
    // }

    // setSubmitting(true);

    // try {
    //   await signIn(form.email, form.password);
    //   const result = await getCurrentUser();
    //   setUser(result);
    //   setIsLogged(true);

    //   Alert.alert("Success", "User signed in successfully");
    //   router.replace("/home");
    // } catch (error) {
    //   Alert.alert("Error", error.message);
    // } finally {
    //   setSubmitting(false);
    // }
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView>
        <View className="w-full justify-center items-center min-h-[85vh] px-4 my-6">
          <Image source={images.neural}
            resizeMode='contain' className="w-[150px] h-[150px]"
          />

          <Text className="text-darkMauve text-xl font-semibold">
            Login to the Neural Kinetic Sculpture app
          </Text>

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({...form, email: e})}
            otherStyles="mt-7"
            keyboardType="email-address"
          />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({...form, password: e})}
            otherStyles="mt-7"
          />

          <LoginButton 
            title="Sign in"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignUp