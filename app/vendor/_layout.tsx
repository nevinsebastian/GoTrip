import { Stack } from 'expo-router';

export default function VendorLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="describe-property" options={{ headerShown: false }} />
      <Stack.Screen name="describe-camp" options={{ headerShown: false }} />
      <Stack.Screen name="select-location" options={{ headerShown: false }} />
      <Stack.Screen name="guest-room-details" options={{ headerShown: false }} />
      <Stack.Screen name="guest-tent-details" options={{ headerShown: false }} />
      <Stack.Screen name="amenities" options={{ headerShown: false }} />
      <Stack.Screen name="photos" options={{ headerShown: false }} />
      <Stack.Screen name="create-title" options={{ headerShown: false }} />
      <Stack.Screen name="set-pricing" options={{ headerShown: false }} />
      <Stack.Screen name="camping-insights" options={{ headerShown: false }} />
      <Stack.Screen name="inclusions-exclusions" options={{ headerShown: false }} />
      <Stack.Screen name="terms" options={{ headerShown: false }} />
      <Stack.Screen name="publish-listing" options={{ headerShown: false }} />
      <Stack.Screen name="thanks" options={{ headerShown: false }} />
    </Stack>
  );
}
