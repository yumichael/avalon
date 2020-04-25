import React from 'react';
import { StyleSheet, Button, View } from 'src/library/ui/components';
import { loggedReactFC } from 'src/library/logging/loggers';
import { NavigationProp } from '@react-navigation/native';
import firebase from 'firebase/app';
import 'firebase/auth';
import * as Facebook from 'expo-facebook';

export let theCredential: firebase.auth.OAuthCredential;
export async function login() {
  try {
    await Facebook.initializeAsync('249184712772571', 'The Resistance');
    const loginResult = await Facebook.logInWithReadPermissionsAsync({
      permissions: ['public_profile'],
    });
    if (loginResult.type === 'success') {
      const { token } = loginResult;
      theCredential = firebase.auth.FacebookAuthProvider.credential(token);
      // Sign in with credential from the Facebook user.
      firebase
        .auth()
        .signInWithCredential(theCredential)
        .catch(error => {
          // Handle Errors here.
        });
    } else {
      // loginResult.type === 'cancel'
    }
  } catch ({ message }) {
    // console.log(`Facebook Login Error: ${message}`);
  }
}

let LoginX: React.FC<{
  navigation: NavigationProp<{ LoginX: {}; LoggedInX: {} }>;
}> = ({ navigation }) => {
  firebase.auth().onAuthStateChanged(user => {
    if (user !== null) {
      navigation.navigate('LoggedInX');
    } else {
      navigation.navigate('LoginX');
    }
  });
  return (
    <View style={styles.screen}>
      <Button onPress={login}>Login with Facebook</Button>
    </View>
  );
};
LoginX = loggedReactFC({ disable: false })(LoginX);

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LoginX;
