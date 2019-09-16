import React, { useContext, useMemo, ReactElement } from 'react';
import { observerWithMeta } from 'src/library/helpers/mobxHelp';
import { PlayingContext, RoomContext } from '../RoomContexts';
import { loggedReactFC } from 'src/library/logging/loggers';
import { Card, View, Text, Button, TouchableRipple } from 'src/library/ui/components';
import bits from 'src/components/bits';
import { ViewStyle } from 'react-native';
import styles from './CommandStyles';

let RoomCommandX: React.FC<{
  startNewGame?: ReactElement | null;
}> = ({ startNewGame }) => {
  const { roomApiInit, state } = useContext(RoomContext);
  const roomApi = roomApiInit.readyInstance;
  const { gameXInsert, playing } = useContext(PlayingContext);
  const gameFinish = playing && playing.getFinish();

  const viewingGameContainerStyle = useViewingGameContainerStyle();
  const notPlayingContainerStyle = useNotPlayingContainerStyle();
  const commandStyle = useMemo(
    () => ({
      ...styles.container,
      ...(gameFinish && state.isViewingGame()
        ? viewingGameContainerStyle
        : !!!playing || gameFinish
        ? notPlayingContainerStyle
        : null),
    }),
    [state.isViewingGame(), playing, gameFinish],
  );
  const element = (
    <Card style={commandStyle}>
      {gameXInsert && state.isViewingGame() ? (
        gameXInsert.getGameCommand()
      ) : startNewGame ? (
        startNewGame
      ) : roomApi ? (
        roomApi.getDirector().isEqual(roomApi.userRef) ? (
          <>
            <View style={styles.instructions}>
              <Text style={styles.text}>
                You are the room's director. Only the room director can start a new game.
              </Text>
            </View>
            <View style={styles.actions}>
              <Button onPress={state.toggleAssigningDirector}>
                {state.isAssigningDirector()
                  ? 'cancel assigning new director'
                  : 'assign new director'}
              </Button>
            </View>
          </>
        ) : (
          <View style={styles.spectating}>
            <Text style={styles.text}>Waiting for the room director to start a new game...</Text>
          </View>
        )
      ) : null}
    </Card>
  );
  return state.isViewingGame() && gameFinish ? (
    <TouchableRipple onPress={state.stopViewingGame} style={styles.touch}>
      {element}
    </TouchableRipple>
  ) : (
    element
  );
};
RoomCommandX = observerWithMeta(loggedReactFC()(RoomCommandX));

function useNotPlayingContainerStyle() {
  const { colors } = bits;
  return useMemo<ViewStyle>(
    () => ({
      borderWidth: 1,
      borderColor: colors.room.passive,
    }),
    [colors],
  );
}
function useViewingGameContainerStyle() {
  const { colors } = bits;
  return useMemo<ViewStyle>(
    () => ({
      borderWidth: 1,
      borderColor: colors.concern.active,
    }),
    [colors],
  );
}

export default RoomCommandX;
