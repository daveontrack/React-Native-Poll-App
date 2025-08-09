import { Redirect, Slot } from 'expo-router';
import { useAuth } from '../../Providers/AuthProvider';

export default function AuthLayout() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Redirect href="/profile" />;
  }

  return <Slot />;
}
