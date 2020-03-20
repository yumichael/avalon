import React from 'react';
import 'src/config/config';
import { NavigationContainer } from '@react-navigation/native';
import LoginNavigatorX from './components/Main/LoginNavigator';

export default function App() {
  return (
    <NavigationContainer>
      <LoginNavigatorX />
    </NavigationContainer>
  );
}
