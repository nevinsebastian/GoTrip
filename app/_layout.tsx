import {
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';
import { HomeSearchProvider } from '@/src/components/home/HomeSearchContext';
import { VendorModeRouteGuard } from '@/src/components/vendor/VendorModeRouteGuard';

export {
    // Catch any errors thrown in the navigation tree.
    ErrorBoundary
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'index',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    'poppins-400': Poppins_400Regular,
    'poppins-500': Poppins_500Medium,
    'poppins-600': Poppins_600SemiBold,
    'poppins-700': Poppins_700Bold,
    poppins: Poppins_400Regular, // Default fallback
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // Web: must render the root navigator on the first paint. Returning null until fonts load
  // leaves no Slot/Stack mounted and breaks reloads (e.g. /login) with "Attempted to navigate
  // before mounting the Root Layout". iOS/Android keep the previous wait-for-fonts behavior.
  if (!loaded && Platform.OS !== 'web') {
    return null;
  }

  return <RootLayoutNav />;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <HomeSearchProvider>
          <VendorModeRouteGuard />
          <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="vendor-login" options={{ headerShown: false }} />
          <Stack.Screen name="signup" options={{ headerShown: false }} />
          <Stack.Screen name="otp" options={{ headerShown: false }} />
          <Stack.Screen name="hotels/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="resort/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="package/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="glamping/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="activity/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="booking/review" options={{ headerShown: false }} />
          <Stack.Screen name="resorts" options={{ headerShown: false }} />
          <Stack.Screen name="packages" options={{ headerShown: false }} />
          <Stack.Screen name="account-settings" options={{ headerShown: false }} />
          <Stack.Screen name="become-vendor" options={{ headerShown: false }} />
          <Stack.Screen name="vendor" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        </Stack>
        </HomeSearchProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
