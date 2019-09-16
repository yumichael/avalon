import React from 'react';
import { observerWithMeta } from 'src/library/helpers/mobxHelp';
import { loggedReactFC } from 'src/library/logging/loggers';
import { StyleSheet, ToggleButton } from 'src/library/ui/components';
import bits from 'src/components/bits';

let NewGameButtonX: React.FC<{
  callback: () => void;
  beenActivated: boolean;
}> = ({ callback, beenActivated }) => {
  const { colors } = bits;
  return (
    <ToggleButton
      onPress={callback}
      icon="games"
      color={beenActivated ? colors.room.passive : colors.concern.active}
      status={beenActivated ? 'checked' : 'unchecked'}
      style={styles.default}
    />
  );
};
NewGameButtonX = observerWithMeta(loggedReactFC()(NewGameButtonX));

const styles = StyleSheet.create({
  default: {},
});

export default NewGameButtonX;
