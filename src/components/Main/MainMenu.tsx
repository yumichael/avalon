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
import { NavigationScreenComponent } from 'react-navigation';
import RoomX from '../Room/Room';
import { useEventCallback } from 'src/library/helpers/reactHelp';
import Room from 'src/model/Room/Room';
import bits from '../bits';

let MainMenuX: NavigationScreenComponent = ({ navigation }) => {
  const { userApiInit } = useContext(UserContext); // TODO should deps of hooks include context values from up above? [right now assume yes]
  const userApi = userApiInit.readyInstance;
  const activity = userApi && userApi.activity;
  // const roomApiInit = useHardMemo<RoomApi.Initiator | undefined>(
  //   () => activity && activity.initiateRoomApi(),
  //   [activity],
  // );

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
    navigation.navigate(RoomX.name, { roomRef });
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

  const inputStyle = useInputStyle();
  const fixedInputStyle = useFixedInputStyle();
  const buttonStyle = useButtonStyle();
  return (
    <KeyboardUsingView behavior="padding" style={styles.top}>
      <View style={styles.container}>
        <Text>Hello {userApi && userApi.getDisplayName()}!</Text>
        <Text />
        <Button
          onPress={goMakeNewRoom}
          disabled={!!!userApi || !!!userApi.canOpenAndEnterNewRoom()}
          style={buttonStyle}
        >
          New Room
        </Button>
        <Text />
        <View style={styles.innerContainer}>
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
      </View>
    </KeyboardUsingView>
  );
};
MainMenuX = observerWithMeta(loggedReactFC({ ...loggingBody })(MainMenuX));
MainMenuX.navigationOptions = {
  ...MainMenuX.navigationOptions,
  title: 'Main Menu',
};

const styles = StyleSheet.create({
  top: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerContainer: {
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
