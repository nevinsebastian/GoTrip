import { Stack } from 'expo-router';

export default function VendorLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="describe-property" options={{ headerShown: false }} />
      <Stack.Screen name="select-location" options={{ headerShown: false }} />
      <Stack.Screen name="guest-room-details" options={{ headerShown: false }} />
      <Stack.Screen name="amenities" options={{ headerShown: false }} />
      <Stack.Screen name="photos" options={{ headerShown: false }} />
    </Stack>
  );
}
