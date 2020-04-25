import React, { useEffect } from 'react';
import 'src/config/config';
import { NavigationContainer } from '@react-navigation/native';
import LoginNavigatorX from './components/Main/LoginNavigator';
import { BackHandler } from 'react-native';

export default function App() {
  // Disable Android back button.
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () => true);
  }, []);
  return (
    <NavigationContainer>
      <LoginNavigatorX />
    </NavigationContainer>
  );
}
