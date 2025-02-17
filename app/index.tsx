import { Redirect } from 'expo-router';
import { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';

registerRootComponent(Index);

export default function Index() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Simuler une vérification de connexion (ex: AsyncStorage, API, etc.)
    setTimeout(() => {
      const userIsLoggedIn = false; // Remplace par une vraie vérification
      setIsAuthenticated(userIsLoggedIn);
    }, 1000);
  }, []);

  if (isAuthenticated === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return isAuthenticated ? <Redirect href="/(drawer)/home" /> : <Redirect href="/(auth)/login" />;
}