import { useApp } from '@/contexts/AppContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
  const { state } = useApp();
  const [isChecking, setIsChecking] = useState(true);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  useEffect(() => {
    checkAuthAndOnboarding();
  }, []);

  const checkAuthAndOnboarding = async () => {
    try {
      const onboardingSeen = await AsyncStorage.getItem('onboardingSeen');
      setHasSeenOnboarding(onboardingSeen === 'true');
    } catch (error) {
      // Silent fail
    } finally {
      setIsChecking(false);
    }
  };

  if (isChecking) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // If user hasn't seen onboarding, show it
  if (!hasSeenOnboarding) {
    return <Redirect href="/onboarding" />;
  }

  // If user is authenticated, go to main app
  if (state.isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  // Otherwise, show login
  return <Redirect href="/login" />;
}
