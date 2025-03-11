import { Alert, View, Text, ScrollView, Image } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../constants'
import FormField from '../../components/FormField'
import LoginButton from '../../components/LoginButton'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'expo-router';

const SignIn = () => {
  const router = useRouter();

  const [form, setForm] = useState({
    email: '',
    password: ''
  })

  const [isSubmitting, setSubmitting] = useState(false)

  const submit = async () => {
    if (form.email === "" || form.password === "") {
      Alert.alert("Error", "Please fill in all fields");
    }

    setSubmitting(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      })

      Alert.alert("Success", "User signed in successfully");
      router.replace("/home");
    } catch (error) {
      Alert.alert("Error", "Wrong email or password");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView>
        <View className="w-full justify-center items-center min-h-[83vh] px-4 my-6">
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
            containerStyles="w-96 mt-7"
            isLoading={isSubmitting}
            textStyles="text-white font-medium"
          />

          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-800 font-pregular">
              Don't have an account?
            </Text>

            <Link href="/sign-up" className="text-lg font-psemibold text-medMauve">
              Sign up
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn;