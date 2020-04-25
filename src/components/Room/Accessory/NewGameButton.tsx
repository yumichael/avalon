import React, { useMemo } from 'react';
import { observerWithMeta } from 'src/library/helpers/mobxHelp';
import { loggedReactFC } from 'src/library/logging/loggers';
import { StyleSheet, ToggleButton } from 'src/library/ui/components';
import bits from 'src/components/bits';

let NewGameButtonX: React.FC<{
  callback: () => void;
  beenActivated: boolean;
}> = ({ callback, beenActivated }) => {
  const { colors, icons } = bits;
  const activatedStyle = useActivatedStyle();
  return (
    <ToggleButton
      onPress={callback}
      icon={icons.newGame.default}
      color={colors.concern.active}
      status={beenActivated ? 'checked' : 'unchecked'}
      style={beenActivated ? activatedStyle : styles.default}
    />
  );
};
NewGameButtonX = observerWithMeta(loggedReactFC()(NewGameButtonX));

const styles = StyleSheet.create({
  default: {},
});
function useActivatedStyle() {
  const { colors, alphas } = bits;
  return useMemo(() => ({ backgroundColor: colors.presence.active + alphas.helping.default }), [
    colors.presence.active,
    alphas.helping.default,
  ]);
}

export default NewGameButtonX;
