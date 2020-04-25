import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MainMenuX from './MainMenu';
import RoomX from 'src/components/Room/Room';
import { loggedConstructor } from 'src/library/logging/loggers';

const Stack = createStackNavigator();

let MainNavigatorX: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName="MainMenuX">
      <Stack.Screen name={'MainMenuX'} component={MainMenuX} options={{ title: 'Main Menu' }} />
      <Stack.Screen name={'RoomX'} component={RoomX} options={{ title: '' }} />
    </Stack.Navigator>
  );
};
MainNavigatorX = loggedConstructor({ name: 'MainNavigatorX' })(MainNavigatorX);

export default MainNavigatorX;
