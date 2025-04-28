import { Stack, SplashScreen } from "expo-router";
import "../global.css";
import { useFonts } from 'expo-font'
import { useEffect } from 'react'

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [fontsLoaded, error] = useFonts({
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf")
  });

  useEffect(() => {
    if (error) throw error;
    if(fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded,error])
  useEffect(() => {
    const checkAuthState = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) {
        // Redirect to login if no valid session
        router.replace('/sign-in');
      }
    };
    checkAuthState();
  }, []);

  if(!fontsLoaded && !error) return null;

  return (
        <Stack>
          <Stack.Screen name="index" options={{headerShown: false}} />
          <Stack.Screen name="(auth)" options={{headerShown: false}} />
          <Stack.Screen name="(tabs)" options={{headerShown: false}} />
          <Stack.Screen name="(sub-pages)/create-config-details" options={{headerShown: false}} />
          <Stack.Screen name="(sub-pages)/choose-config-or-edit" options={{headerShown: false}} />
          <Stack.Screen name="(sub-pages)/play-config" options={{headerShown: false}} />
        </Stack>
  )
}

export default RootLayout;
