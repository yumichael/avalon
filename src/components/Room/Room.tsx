import React, { useMemo, useContext, ReactElement, useCallback, useEffect } from 'react';
import { observerWithMeta } from 'src/library/helpers/mobxHelp';
import { RoomContext, PlayingContext } from './RoomContexts';
import GameApi from 'src/model/Game/GameApi';
import { loggedReactFC, loggedFunction } from 'src/library/logging/loggers';
import RoomApi from 'src/model/Room/RoomApi';
import { NavigationScreenComponent, NavigationScreenProp, NavigationRoute } from 'react-navigation';
import { View, StyleSheet, KeyboardAvoidingView } from 'src/library/ui/components';
import RoomBannerX from './Banner/RoomBanner';
import RoomChatX from './Chat/RoomChat';
import RoomCommandX from './Command/RoomCommand';
import Room from 'src/model/Room/Room';
import { useHardMemo, useKeyboard, useStates } from 'src/library/helpers/reactHelp';
import { UserContext } from '../UserContexts';
import GameXInjection from '../Game/GameXInjection';
import SeatX from './Seats/Seat';
import NewGameButtonX from './NewGame/NewGameButton';
import NewGameMenuX from './NewGame/NewGameMenu';
import GameHelpX from '../Game/Help/GameHelp';

export type RoomXState = {
  isAssigningDirector: boolean;
  isViewingGame: boolean;
  isViewingNewGameMenu: boolean;
  isViewingGameHelp: boolean;
};

type RoomXProps = {
  roomRef: Room.Ref;
  accessoryButton?: ReactElement | null;
};
let RoomX: NavigationScreenComponent<RoomXProps> = ({ navigation }) => {
  const { userApiInit } = useContext(UserContext);
  const roomRef = navigation.getParam('roomRef');
  const roomApiInit = useHardMemo<RoomApi.Initiator>(
    () => RoomApi.initiate({ roomRef, userRef: userApiInit.ref }),
    [roomRef.path, userApiInit.ref.path],
  );
  const roomApi = roomApiInit.readyInstance;
  const roomContextValue = useMemo(() => ({ roomApiInit }), [roomApiInit]);
  const playing = roomApi && roomApi.playing;

  const gameApiInit = useHardMemo<GameApi.Initiator | undefined>(
    () => playing && playing.initiateGameApi(),
    [playing],
  );
  const gameApi = gameApiInit && gameApiInit.readyInstance;
  const gameXInjection = useHardMemo<GameXInjection | undefined>(
    () => gameApi && new GameXInjection(gameApi),
    [gameApi],
  );
  const playingContextValue = useMemo(
    () => ({
      playing,
      gameXInjection,
    }),
    [playing, gameXInjection],
  );
  const gameFinish = playing && playing.getFinish();

  // room UI state

  const usingRoomXState = useStates<RoomXState>({
    isAssigningDirector: false,
    isViewingGame: false,
    isViewingNewGameMenu: false,
    isViewingGameHelp: false,
  });

  const [isViewingGame, setIsViewingGame] = usingRoomXState.isViewingGame;
  if (!!!isViewingGame && gameApi && !!!gameFinish) {
    setIsViewingGame(true);
  }

  const [isViewingNewGameMenu, setIsViewingNewGameMenu] = usingRoomXState.isViewingNewGameMenu;
  useEffect(() => setIsViewingNewGameMenu(false), [gameApi]);
  const toggleViewingNewGameMenu = useCallback(
    () => setIsViewingNewGameMenu(previousIsViewingNewGameMenu => !!!previousIsViewingNewGameMenu),
    [setIsViewingNewGameMenu],
  );

  const [isViewingGameHelp, setIsViewingGameHelp] = usingRoomXState.isViewingGameHelp;
  const toggleViewingGameHelp = useCallback(
    () => setIsViewingGameHelp(previousIsViewingGameHelp => !!!previousIsViewingGameHelp),
    [setIsViewingGameHelp],
  );

  const whichAccessoryButton = isViewingGame
    ? 'gameHelp'
    : roomApi && roomApi.canStartNewGame()
    ? 'newGame'
    : null;
  const accessoryButton = useHardMemo(
    () =>
      whichAccessoryButton === 'newGame' ? (
        <NewGameButtonX callback={toggleViewingNewGameMenu} isActivated={isViewingNewGameMenu} />
      ) : whichAccessoryButton === 'gameHelp' && gameXInjection ? (
        gameXInjection.getGameHelpButton({
          callback: toggleViewingGameHelp,
          isActivated: !!!toggleViewingGameHelp,
        })
      ) : null,
    [whichAccessoryButton, toggleViewingNewGameMenu, isViewingNewGameMenu],
  );
  const previousAccessoryButton = navigation.getParam('accessoryButton');
  useEffect(() => {
    if (accessoryButton && accessoryButton !== previousAccessoryButton) {
      navigation.setParams({ accessoryButton });
    }
  }, [accessoryButton, previousAccessoryButton]);

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

  return roomContextValue ? (
    <View style={styles.default}>
      <RoomContext.Provider value={roomContextValue}>
        <PlayingContext.Provider value={playingContextValue}>
          <KeyboardAvoidingView behavior="padding" style={attentionStyle}>
            {!!!keyboard ? (
              <View style={styles.banner}>
                <RoomBannerX usingRoomXState={usingRoomXState} />
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
                  {isViewingGameHelp ? <GameHelpX /> : <RoomChatX />}
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
                {isViewingNewGameMenu ? (
                  <NewGameMenuX />
                ) : (
                  <RoomCommandX usingRoomXState={usingRoomXState} />
                )}
              </View>
            ) : null}
            {gameXInjection ? gameXInjection.getHostWorker() : undefined}
          </KeyboardAvoidingView>
        </PlayingContext.Provider>
      </RoomContext.Provider>
    </View>
  ) : null;
};
RoomX = observerWithMeta(loggedReactFC()(RoomX));
const defaultNavigationOptions = RoomX.navigationOptions;
RoomX.navigationOptions = loggedFunction({ name: 'RoomX.navigationOptions' })(
  ({
    navigation,
  }: {
    navigation: NavigationScreenProp<NavigationRoute<RoomXProps>, RoomXProps>;
  }) => {
    const accessoryButton = navigation.getParam('accessoryButton');
    return {
      ...defaultNavigationOptions,
      ...(accessoryButton ? { headerRight: accessoryButton } : null),
    };
  },
);

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
    marginBottom: 40,
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
