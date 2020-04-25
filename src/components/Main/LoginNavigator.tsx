import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginX from './Login';
import LoggedInX from './LoggedIn';
import { loggedConstructor } from 'src/library/logging/loggers';

const Stack = createStackNavigator();

let LoginNavigatorX: React.FC = () => {
  return (
    <Stack.Navigator headerMode="none" initialRouteName="LoginX">
      <Stack.Screen name={'LoginX'} component={LoginX} />
      <Stack.Screen name={'LoggedInX'} component={LoggedInX} />
    </Stack.Navigator>
  );
};
LoginNavigatorX = loggedConstructor({ name: 'LoginNavigatorX' })(LoginNavigatorX);

export default LoginNavigatorX;
