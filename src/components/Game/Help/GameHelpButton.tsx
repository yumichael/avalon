import React from 'react';
import { observerWithMeta } from 'src/library/helpers/mobxHelp';
import { loggedReactFC } from 'src/library/logging/loggers';
import { StyleSheet, IconButton } from 'src/library/ui/components';
import { useColors } from 'src/components/bits';
import NeedToInform from '../state/NeedToInform';

let GameHelpButtonX: React.FC<{
  callback: () => void;
  isActivated: boolean;
  needToInform: NeedToInform;
}> = ({ callback, isActivated, needToInform }) => {
  const colors = useColors();
  return (
    <IconButton
      onPress={callback}
      icon={'help'}
      color={isActivated ? colors.concern.passive : colors.concern.active}
      style={styles.default}
    />
  );
};
GameHelpButtonX = observerWithMeta(loggedReactFC()(GameHelpButtonX));

const styles = StyleSheet.create({
  default: {},
});

export default GameHelpButtonX;
