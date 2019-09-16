import React, { useContext, ReactElement } from 'react';
import { observerWithMeta } from 'src/library/helpers/mobxHelp';
import { loggedReactFC } from 'src/library/logging/loggers';
import { StyleSheet, View } from 'src/library/ui/components';
import { RoomContext, PlayingContext } from '../RoomContexts';
import NewGameButtonX from './NewGameButton';

let AccessoryBarX: React.FC = () => {
  const { roomApiInit, state } = useContext(RoomContext);
  const { gameXInsert } = useContext(PlayingContext);
  const roomApi = roomApiInit.readyInstance;
  const buttons: ReactElement[] = [];
  const playing = roomApi && roomApi.playing;
  const finish = playing && playing.getFinish();
  if (!!!playing || finish) {
    buttons.push(
      <NewGameButtonX
        key="NewGame"
        callback={state.toggleViewingNewGameMenu}
        beenActivated={state.isViewingNewGameMenu()}
      />,
    );
  }
  if (playing && finish && gameXInsert) {
    buttons.push(gameXInsert.getViewSecretsButton());
  }
  if (gameXInsert) {
    buttons.push(
      gameXInsert.getGameHelpButton({
        callback: state.toggleViewingGameHelp,
        beenActivated: state.isViewingGameHelp(),
      }),
    );
  }
  for (const [i, e] of buttons.entries()) {
    buttons[i] = (
      <View style={styles.wrapper} key={e.key === null ? undefined : e.key}>
        {e}
      </View>
    );
  }
  return <View style={styles.container}>{buttons}</View>;
};
AccessoryBarX = observerWithMeta(loggedReactFC()(AccessoryBarX));

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row-reverse',
    paddingHorizontal: 1,
  },
  wrapper: {
    marginHorizontal: 1,
  },
});

export default AccessoryBarX;