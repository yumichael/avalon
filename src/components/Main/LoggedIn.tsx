import React, { useMemo } from 'react';
import { UserContext } from '../UserContexts';
import UserApi from 'src/model/User/UserApi';
import { loggedReactFC } from 'src/library/logging/loggers';
import MainNavigatorX from './MainNavigator';
import User from 'src/model/User/User';
import { useHardMemo } from 'src/library/helpers/reactHelp';
import { NavigationProp, RouteProp } from '@react-navigation/native';

let LoggedInX: React.FC<{
  navigation: NavigationProp<{}>;
  route: RouteProp<{ idk: { userId: User.Id } }, 'idk'>;
}> = ({ navigation, route }) => {
  const { userId } = route.params;
  const userRef = User.ref(userId);
  const userApiInit = useHardMemo<UserApi.Initiator>(() => UserApi.initiate({ userRef }), [
    userRef.path,
  ]);
  const userContextValue = useMemo(() => ({ userApiInit }), [userApiInit]);
  return (
    <UserContext.Provider value={userContextValue}>
      <MainNavigatorX />
    </UserContext.Provider>
  );
};
LoggedInX = loggedReactFC()(LoggedInX);

export default LoggedInX;
