import React, { useMemo, useContext, useEffect } from 'react';
import { RoomContext, PlayingContext } from './RoomContexts';
import GameApi from 'src/model/Game/GameApi';
import { loggedReactFC } from 'src/library/logging/loggers';
import RoomApi from 'src/model/Room/RoomApi';
import { View, StyleSheet, KeyboardAvoidingView } from 'src/library/ui/components';
import RoomBannerX from './Banner/RoomBanner';
import RoomChatX from './Chat/RoomChat';
import RoomCommandX from './Command/RoomCommand';
import Room from 'src/model/Room/Room';
import { useHardMemo, useKeyboard } from 'src/library/helpers/reactHelp';
import { UserContext } from '../UserContexts';
import GameXInsert from '../Game/GameXInsert';
import SeatX from './Seats/Seat';
import NewGameMenuXInsert from './NewGame/NewGameMenuXInsert';
import RoomXState from './RoomXState';
import AccessoryBarX from './Accessory/AccessoryBar';
import { Platform } from 'react-native';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { observerWithMeta } from 'src/library/helpers/mobxHelp';

let RoomX: React.FC<{
  navigation: NavigationProp<{}>;
  route: RouteProp<{ idk: { roomRef: Room.Ref } }, 'idk'>;
}> = ({ navigation, route }) => {
  const { userApiInit } = useContext(UserContext);
  const userApi = userApiInit.readyInstance;
  const { roomRef } = route.params;
  const roomApiInit = useHardMemo<RoomApi.Initiator>(
    () =>
      RoomApi.initiate({
        roomRef,
        userRef: userApiInit.ref,
        userProperties: { displayName: userApi?.getDisplayName() || '[missing name]' },
      }),
    [roomRef.path, userApiInit.ref.path],
  );
  const roomApi = roomApiInit.readyInstance;
  const playing = roomApi?.playing;

  const gameApiInit = useHardMemo<GameApi.Initiator | undefined>(() => playing?.initiateGameApi(), [
    playing,
  ]);
  const gameApi = gameApiInit?.readyInstance;
  const gameXInsert = useHardMemo<GameXInsert | undefined>(
    () => gameApi && new GameXInsert(gameApi),
    [gameApi],
  );
  const playingContextValue = useMemo(
    () => ({
      playing,
      gameXInsert,
    }),
    [playing, gameXInsert],
  );
  const gameFinish = playing?.getFinish();

  // room UI state

  const state = useHardMemo(() => new RoomXState(), [roomRef]);
  const roomContextValue = useMemo(() => ({ roomApiInit, state }), [roomApiInit]);

  if (gameApi && !!!gameFinish && !!!state.isViewingGame()) {
    state.viewGame();
  }
  useEffect(state.stopAssigningDirector, [roomApi?.getDirector().isEqual(roomApi.userRef)]);
  useEffect(state.stopViewingNewGameMenu, [gameApi]);
  useEffect(state.stopViewingGameHelp, [gameApi]);

  const accessoryBar = useHardMemo(
    () => (
      <RoomContext.Provider value={roomContextValue}>
        <PlayingContext.Provider value={playingContextValue}>
          <AccessoryBarX />
        </PlayingContext.Provider>
      </RoomContext.Provider>
    ),
    [state, roomContextValue, playingContextValue],
  );
  // const previousAccessoryButton = navigation.getParam('accessoryButton');
  // useEffect(() => {
  //   if (accessoryButton && accessoryButton !== previousAccessoryButton) {
  //     navigation.setParams({ accessoryButton });
  //   }
  // }, [accessoryButton, previousAccessoryButton]);
  useEffect(() => {
    navigation.setOptions({ headerRight: () => accessoryBar });
  }, [navigation, accessoryBar]);

  const keyboard = useKeyboard();
  const attentionStyle = useMemo(
    () => ({
      ...styles.attention,
      ...(keyboard ? { marginTop: 0 } : null),
    }),
    [keyboard],
  );
  const centerStyle = useMemo(
    () => ({
      ...styles.center,
      ...(keyboard ? styles.withKeyboard : null),
    }),
    [keyboard],
  );

  const newGameMenuXInsert = useHardMemo(() => new NewGameMenuXInsert(), [state]);

  return roomContextValue ? (
    <View style={styles.default}>
      <RoomContext.Provider value={roomContextValue}>
        <PlayingContext.Provider value={playingContextValue}>
          <KeyboardAvoidingView behavior="padding" style={attentionStyle}>
            {!!!keyboard ? (
              <View style={styles.banner}>
                <RoomBannerX />
              </View>
            ) : null}
            <View style={centerStyle}>
              <View style={styles.left}>
                <SeatX seatIndex={9} />
                <SeatX seatIndex={8} />
                <SeatX seatIndex={7} />
                <SeatX seatIndex={6} />
              </View>
              <View style={styles.middle}>
                <SeatX seatIndex={0} />
                <View style={styles.dialog}>
                  {state.isViewingGameHelp() && gameXInsert ? (
                    gameXInsert.getGameHelp()
                  ) : (
                    <RoomChatX />
                  )}
                </View>
                <SeatX seatIndex={5} />
              </View>
              <View style={styles.right}>
                <SeatX seatIndex={1} />
                <SeatX seatIndex={2} />
                <SeatX seatIndex={3} />
                <SeatX seatIndex={4} />
              </View>
            </View>
            {!!!keyboard ? (
              <View style={styles.command}>
                <RoomCommandX
                  startNewGame={
                    state.isViewingNewGameMenu() ? newGameMenuXInsert.getStartNewGame() : null
                  }
                />
              </View>
            ) : null}
            {gameXInsert ? gameXInsert.getHostWorker() : undefined}
          </KeyboardAvoidingView>
        </PlayingContext.Provider>
      </RoomContext.Provider>
    </View>
  ) : null;
};
RoomX = observerWithMeta(loggedReactFC()(RoomX));
// const defaultNavigationOptions = RoomX.navigationOptions;
// RoomX.navigationOptions = loggedFunction({ name: 'RoomX.navigationOptions' })(
//   ({
//     navigation,
//   }: {
//     navigation: NavigationScreenProp<NavigationRoute<RoomXProps>, RoomXProps>;
//   }) => {
//     const accessoryBar = navigation.getParam('accessoryBar');
//     return {
//       ...defaultNavigationOptions,
//       ...(accessoryBar ? { headerRight: accessoryBar } : null),
//     };
//   },
// );

const styles = StyleSheet.create({
  default: {
    flex: 1,
    alignItems: 'stretch',
  },
  withKeyboard: {
    flex: 0.816,
  },
  attention: {
    flex: 1,
    margin: 30,
    marginBottom: 30 + (Platform.OS === 'ios' ? 10 : 0),
    justifyContent: 'space-between',
    alignItems: 'stretch',
  },
  center: {
    flex: 0.7,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
  },
  left: { justifyContent: 'space-between' },
  middle: { flex: 1, alignItems: 'stretch', justifyContent: 'space-between', zIndex: 1 },
  dialog: {
    flex: 2,
    margin: 1,
  },
  right: { justifyContent: 'space-between' },
  banner: {
    flex: 0.15,
    alignItems: 'stretch',
  },
  command: {
    flex: 0.15,
    alignItems: 'stretch',
  },
});

export default RoomX;
