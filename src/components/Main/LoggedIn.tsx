import React, { useMemo } from 'react';
import { UserContext } from '../UserContexts';
import UserApi from 'src/model/User/UserApi';
import { loggedReactFC } from 'src/library/logging/loggers';
import MainNavigatorX from './MainNavigator';
import User from 'src/model/User/User';
import { useHardMemo } from 'src/library/helpers/reactHelp';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import firebase from 'firebase/app';

let LoggedInX: React.FC<{
  navigation: NavigationProp<{}>;
  route: RouteProp<{ idk: {} }, 'idk'>;
}> = ({ navigation, route }) => {
  const user = firebase.auth().currentUser as firebase.User;
  const userRef = User.ref(user.providerData[0]!.uid);
  const userDoc = User.dataApi.openUntrackedDoc(userRef);
  const userData: User.Data = { displayName: user.displayName || '[no name]' };
  userDoc.set(userData, { merge: true });

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
