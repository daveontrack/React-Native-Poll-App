import { Stack } from 'expo-router';
import AuthProvider from '../Providers/AuthProvider';


export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="(auth)" options={{ title: 'Login' }} />
      </Stack>
    </AuthProvider>
  );
}
