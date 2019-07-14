import React, { useMemo } from 'react';
import { UserContext } from '../UserContexts';
import UserApi from 'src/model/User/UserApi';
import { loggedReactFC } from 'src/library/logging/loggers';
import MainNavigatorX from './MainNavigator';
import {
  NavigationScreenComponent,
  NavigationContainer,
} from 'src/library/ui/components';
import User from 'src/model/User/User';
import { useHardMemo } from 'src/library/helpers/reactHelp';

let LoggedInX: NavigationScreenComponent<{ userRef: User.Ref }> = ({
  navigation,
}) => {
  const userRef = navigation.getParam('userRef');
  const userApiInit = useHardMemo<UserApi.Initiator>(
    () => UserApi.initiate({ userRef }),
    [userRef.path],
  );
  const userContextValue = useMemo(() => ({ userApiInit }), [userApiInit]);
  return (
    <UserContext.Provider value={userContextValue}>
      <MainNavigatorX navigation={navigation as any} />
    </UserContext.Provider>
  );
};
LoggedInX = loggedReactFC()(LoggedInX);
((LoggedInX as unknown) as NavigationContainer).router = MainNavigatorX.router;
((LoggedInX as unknown) as NavigationContainer).navigationOptions =
  MainNavigatorX.navigationOptions;

export default LoggedInX;
