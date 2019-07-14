import React from 'react';
import { observerWithMeta } from 'src/library/helpers/mobxHelp';
import { loggedReactFC } from 'src/library/logging/loggers';
import { StyleSheet, IconButton } from 'src/library/ui/components';
import { useColors } from 'src/components/bits';

let NewGameButtonX: React.FC<{ callback: () => void; isActivated: boolean }> = ({
  callback,
  isActivated,
}) => {
  const colors = useColors();
  return (
    <IconButton
      onPress={callback}
      icon={'games'}
      color={isActivated ? colors.concern.passive : colors.concern.active}
      style={styles.default}
    />
  );
};
NewGameButtonX = observerWithMeta(loggedReactFC()(NewGameButtonX));

const styles = StyleSheet.create({
  default: {},
});

export default NewGameButtonX;
