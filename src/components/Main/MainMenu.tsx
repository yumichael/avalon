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
  }, [userApi, roomId]);

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

  return (
    <KeyboardUsingView behavior="padding" style={styles.default}>
      <View>
        <Text>Hello {userApi && userApi.getDisplayName()}!</Text>
        <Text />
        <Button
          onPress={goMakeNewRoom}
          disabled={!!!userApi || !!!userApi.canOpenAndEnterNewRoom()}
        >
          New Room
        </Button>
        <Text />
        <View>
          <TextInput
            returnKeyType="done"
            placeholder="Enter the room ID"
            value={roomId}
            onChangeText={setRoomId}
            editable={!!!(userApi && userApi.activity)}
            style={styles.input}
          />
          {userApi && activity ? (
            <>
              <Button onPress={goToRoom} disabled={!!!userApi.canEnterRoom(activity.getRoomRef())}>
                Open Room
              </Button>
              <Button
                onPress={goCloseRoom}
                disabled={!!!userApi.canExitRoom(activity.getRoomRef())}
              >
                Close Room
              </Button>
            </>
          ) : (
            <Button onPress={goToRoom} disabled={!!!userApi || !!!userApi.canEnterRoom()}>
              Join Room
            </Button>
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
  default: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {},
});

export default MainMenuX;
