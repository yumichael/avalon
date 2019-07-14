import 'src/config/config';
import { createAppContainer } from 'react-navigation';
import LoginNavigatorX from './components/Main/LoginNavigator';

const AppX = createAppContainer(LoginNavigatorX);

export default AppX;
