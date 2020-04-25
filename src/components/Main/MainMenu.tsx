import React, { useContext, useState, useCallback, useMemo } from 'react';
import { observerWithMeta } from 'src/library/helpers/mobxHelp';
import {
  Text,
  StyleSheet,
  TextInput,
  KeyboardUsingView,
  View,
  Button,
} from 'src/library/ui/components';
import { loggedReactFC, loggingBody } from 'src/library/logging/loggers';
import { UserContext } from '../UserContexts';
import { NavigationProp } from '@react-navigation/native';
import { useEventCallback } from 'src/library/helpers/reactHelp';
import Room from 'src/model/Room/Room';
import bits from 'src/components/bits';
import firebase from 'firebase/app';
import { theCredential, login } from './Login';
import UserAvatarX from 'src/components/Room/User/UserAvatar';

let MainMenuX: React.FC<{ navigation: NavigationProp<{ RoomX: { roomRef: Room.Ref } }> }> = ({
  navigation,
}) => {
  const { userApiInit } = useContext(UserContext); // TODO should deps of hooks include context values from up above? [right now assume yes]
  const userApi = userApiInit.readyInstance;
  const activity = userApi && userApi.activity;

  const [roomId, setRoomId] = useState('');
  useMemo(() => {
    if (userApi && userApi.activity) {
      setRoomId(userApi.activity.getRoomRef().id);
    }
  }, [activity]);

  const goToRoom = useEventCallback(() => {
    const roomRef = Room.ref(roomId);
    if (userApi) {
      userApi.enterRoom(roomRef);
    }
    navigation.navigate('RoomX', { roomRef });
  }, [navigation, userApi, roomId]);

  const goMakeNewRoom = useCallback(() => {
    if (userApi) {
      userApi.openAndEnterNewRoom();
    }
  }, [userApi]);

  const goCloseRoom = useCallback(() => {
    if (userApi) {
      userApi.exitRoom();
    }
  }, [userApi]);

  const signOut = useCallback(() => {
    firebase
      .auth()
      .currentUser?.delete()
      .catch(() =>
        login().then(() =>
          firebase
            .auth()
            .currentUser?.reauthenticateWithCredential(theCredential)
            .then(() => firebase.auth().currentUser?.delete()),
        ),
      );
  }, [firebase]);

  const inputStyle = useInputStyle();
  const fixedInputStyle = useFixedInputStyle();
  const buttonStyle = useButtonStyle();
  return (
    <KeyboardUsingView behavior="padding" style={styles.container}>
      <View style={styles.top}>
        <Text style={styles.title}>{bits.fancyText.theGame}</Text>
      </View>
      <View style={styles.body}>
        <UserAvatarX userRef={userApiInit.ref} size={100} />
        <Text />
        <Text>Hello {userApi?.getDisplayName()}!</Text>
        <Text />
        <Button
          onPress={goMakeNewRoom}
          disabled={!!!userApi || !!!userApi.canOpenAndEnterNewRoom()}
          style={buttonStyle}
        >
          New Room
        </Button>
        <Text />
        <View style={styles.roomBody}>
          <TextInput
            returnKeyType="done"
            placeholder="Room Code"
            value={roomId}
            onChangeText={setRoomId}
            editable={!!!(userApi && userApi.activity)}
            autoCompleteType="off"
            autoCorrect={false}
            autoCapitalize="none"
            style={!!!(userApi && userApi.activity) ? inputStyle : fixedInputStyle}
          />
          {userApi && activity ? (
            <>
              <Button
                onPress={goToRoom}
                disabled={!!!userApi.canEnterRoom(activity.getRoomRef())}
                style={buttonStyle}
              >
                Open Room
              </Button>
              <Button
                onPress={goCloseRoom}
                disabled={!!!userApi.canExitRoom(activity.getRoomRef())}
                style={buttonStyle}
              >
                Close Room
              </Button>
            </>
          ) : (
            <>
              <Button
                onPress={goToRoom}
                disabled={!!!userApi || !!!Room.isValidRoomId(roomId) || !!!userApi.canEnterRoom()}
                style={buttonStyle}
              >
                Join Room
              </Button>
              <Button disabled={true} style={buttonStyle}>
                Close Room
              </Button>
            </>
          )}
        </View>
        <Text />
      </View>
      <View style={styles.bottom}>
        <Button onPress={signOut} style={buttonStyle}>
          Sign Out
        </Button>
      </View>
    </KeyboardUsingView>
  );
};
MainMenuX = observerWithMeta(loggedReactFC({ ...loggingBody })(MainMenuX));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  top: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottom: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roomBody: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  baseInput: {
    height: bits.constSizes.inputHeight,
    width: 130,
    borderWidth: 1,
    margin: 3,
    textAlign: 'center',
  },
  title: {
    fontSize: 36,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});
function useInputStyle() {
  const { colors } = bits;
  return useMemo(() => ({ ...styles.baseInput, borderColor: colors.room.passive }), [
    styles.baseInput,
    colors.room.passive,
  ]);
}
function useFixedInputStyle() {
  return useMemo(() => ({ ...styles.baseInput, borderColor: 'black' }), [styles.baseInput]);
}
function useButtonStyle() {
  return useMemo(() => ({}), []);
}

export default MainMenuX;
