import React, { useCallback, useState } from 'react';
import {
  Text,
  StyleSheet,
  TextInput,
  KeyboardUsingView,
  View,
  Button,
} from 'src/library/ui/components';
import { loggedReactFC } from 'src/library/logging/loggers';
import { NavigationProp } from '@react-navigation/native';
import User from 'src/model/User/User';

let LoginX: React.FC<{ navigation: NavigationProp<{ LoggedInX: { userId: User.Id } }> }> = ({
  navigation,
}) => {
  const [userId, setUserId] = useState(() => '');
  const goLogin = useCallback(() => {
    navigation.navigate('LoggedInX', { userId });
  }, [userId]);
  return (
    <KeyboardUsingView behavior="padding" style={styles.screen}>
      <View>
        <Text>Welcome</Text>
      </View>
      <TextInput
        returnKeyType="done"
        placeholder="Enter your user ID"
        value={userId}
        onChangeText={setUserId}
      />
      <Text />
      <Button onPress={goLogin}>Login</Button>
    </KeyboardUsingView>
  );
};
LoginX = loggedReactFC({ disable: false })(LoginX);

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {},
});

export default LoginX;
