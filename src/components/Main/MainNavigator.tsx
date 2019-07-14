import { createStackNavigator } from 'react-navigation';
import MainMenuX from './MainMenu';
import RoomX from '../Room/Room';
import { loggedConstructor } from 'src/library/logging/loggers';

let MainNavigatorX = createStackNavigator(
  {
    [MainMenuX.name]: {
      screen: MainMenuX,
    },
    [RoomX.name]: {
      screen: RoomX,
    },
  },
  {
    initialRouteName: MainMenuX.name,
  },
);
MainNavigatorX = loggedConstructor({ name: 'MainNavigatorX' })(MainNavigatorX);

export default MainNavigatorX;
