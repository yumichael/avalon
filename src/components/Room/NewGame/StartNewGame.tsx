import React, { useContext, useCallback } from 'react';
import { observerWithMeta } from 'src/library/helpers/mobxHelp';
import { loggedReactFC } from 'src/library/logging/loggers';
import { Button, View, Text } from 'src/library/ui/components';
import { RoomContext } from '../RoomContexts';
import bits from 'src/components/bits';
import Game from 'src/model/Game/Game';
import styles from '../Command/CommandStyles';

const noRoles = {};

let StartNewGameX: React.FC = () => {
  const { roomApiInit, state } = useContext(RoomContext);
  const roomApi = roomApiInit.readyInstance;
  const startNewGame = useCallback(() => {
    if (roomApi) {
      roomApi.startNewGame({ roleStack: noRoles });
    }
    state.stopViewingNewGameMenu();
  }, [roomApi]);
  const playerCount = roomApi ? roomApi.getSeatedCount() : 0;

  const { colors } = bits;
  return roomApi ? (
    <>
      <View style={styles.instructions}>
        <Text style={styles.text}>
          {playerCount < Game.Player.Count.min
            ? `There must be at least ${Game.Player.Count.min} users seated to play.`
            : `Ready to play with ${playerCount} players.`}
        </Text>
      </View>
      <View style={styles.actions}>
        <Button
          onPress={startNewGame}
          disabled={!!!roomApi || !!!roomApi.canStartNewGame()}
          color={colors.room.active}
        >
          start new game
        </Button>
      </View>
    </>
  ) : null;
};
StartNewGameX = observerWithMeta(loggedReactFC()(StartNewGameX));

export default StartNewGameX;
