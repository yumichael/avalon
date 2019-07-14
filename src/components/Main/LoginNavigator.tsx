import { createSwitchNavigator } from 'react-navigation';
import LoginX from './Login';
import LoggedInX from './LoggedIn';
import { loggedConstructor } from 'src/library/logging/loggers';

let LoginNavigatorX = createSwitchNavigator({
  LoginX,
  LoggedInX,
});
LoginNavigatorX = loggedConstructor({ name: 'LoginNavigatorX' })(
  LoginNavigatorX,
);

export default LoginNavigatorX;
