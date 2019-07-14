import React, { useContext, useMemo, useCallback } from 'react';
import { observerWithMeta } from 'src/library/helpers/mobxHelp';
import { PlayingContext, RoomContext } from '../RoomContexts';
import { loggedReactFC } from 'src/library/logging/loggers';
import { StyleSheet, Card, View, Text, Button, TouchableRipple } from 'src/library/ui/components';
import { RoomXState } from '../Room';
import { UsingStates } from 'src/library/helpers/reactHelp';
import { useColors } from 'src/components/bits';
import { ViewStyle } from 'react-native';

let RoomCommandX: React.FC<{
  usingRoomXState: UsingStates<RoomXState>;
}> = ({
  usingRoomXState: {
    isAssigningDirector: [isAssigningDirector, setIsAssigningDirector],
    isViewingGame: [isViewingGame, setIsViewingGame],
  },
}) => {
  const { roomApiInit } = useContext(RoomContext);
  const roomApi = roomApiInit.readyInstance;
  const { gameXInjection, playing } = useContext(PlayingContext);

  const toggleAssignDirector = useCallback(
    () => setIsAssigningDirector(previousIsAssigningDirector => !!!previousIsAssigningDirector),
    [setIsAssigningDirector],
  );
  const stopViewingGame = useCallback(() => setIsViewingGame(false), [setIsViewingGame]);
  const gameFinish = playing && playing.getFinish();

  const viewingGameContainerStyle = useViewingGameContainerStyle();
  const notPlayingContainerStyle = useNotPlayingContainerStyle();
  const commandStyle = useMemo(
    () => ({
      ...styles.container,
      ...(gameFinish && isViewingGame
        ? viewingGameContainerStyle
        : !!!playing || gameFinish
        ? notPlayingContainerStyle
        : null),
    }),
    [isViewingGame, playing, gameFinish],
  );
  const element = (
    <Card style={commandStyle}>
      {gameXInjection && isViewingGame ? (
        gameXInjection.getGameCommand()
      ) : roomApi ? (
        roomApi.getDirector().isEqual(roomApi.userRef) ? (
          <View style={styles.command}>
            <Text style={styles.text}>
              You are the room's director. Only the room director can start a new game.
            </Text>
            <Button onPress={toggleAssignDirector}>
              {isAssigningDirector ? 'CANCEL ASSIGNING NEW DIRECTOR' : 'ASSIGN NEW DIRECTOR'}
            </Button>
          </View>
        ) : null
      ) : null}
    </Card>
  );
  return isViewingGame && gameFinish ? (
    <TouchableRipple onPress={stopViewingGame} style={styles.touch}>
      {element}
    </TouchableRipple>
  ) : (
    element
  );
};
RoomCommandX = observerWithMeta(loggedReactFC()(RoomCommandX));

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  command: {
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
  },
  touch: {
    flex: 1,
  },
});
function useNotPlayingContainerStyle() {
  const colors = useColors();
  return useMemo<ViewStyle>(
    () => ({
      borderWidth: 1,
      borderColor: colors.room.passive,
    }),
    [colors],
  );
}
function useViewingGameContainerStyle() {
  const colors = useColors();
  return useMemo<ViewStyle>(
    () => ({
      borderWidth: 1,
      borderColor: colors.concern.active,
    }),
    [colors],
  );
}

export default RoomCommandX;
