import React, { useContext } from 'react';
import { observerWithMeta } from 'src/library/helpers/mobxHelp';
import { loggedReactFC } from 'src/library/logging/loggers';
import { StyleSheet, ToggleButton } from 'src/library/ui/components';
import { useColors, useIcons } from 'src/components/bits';
import { GameContext } from '../GameContexts';

let GameHelpButtonX: React.FC<{
  callback: () => void;
  beenActivated: boolean;
}> = ({ callback, beenActivated }) => {
  const { gameApi } = useContext(GameContext);
  const { info, act } = gameApi;
  // TODO a hack in line below to deal with this component still reacting to old Game Doc when starting new game.
  const needToInform =
    gameApi.getDataState() === 'ready' && act && !!!act.hasSeenRole() && !!!info.getGameFinish();
  const colors = useColors();
  const icons = useIcons();
  return (
    <ToggleButton
      onPress={callback}
      icon={needToInform ? icons.info.default : icons.help.default}
      color={!!!beenActivated && needToInform ? colors.concern.active : colors.room.passive}
      status={beenActivated ? 'checked' : 'unchecked'}
      style={styles.default}
    />
  );
};
GameHelpButtonX = observerWithMeta(loggedReactFC()(GameHelpButtonX));

const styles = StyleSheet.create({
  default: {},
});

export default GameHelpButtonX;
