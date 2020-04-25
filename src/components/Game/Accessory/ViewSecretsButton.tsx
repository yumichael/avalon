import React, { useMemo } from 'react';
import { observerWithMeta } from 'src/library/helpers/mobxHelp';
import { loggedReactFC } from 'src/library/logging/loggers';
import { StyleSheet, ToggleButton } from 'src/library/ui/components';
import bits from 'src/components/bits';
import SecretsView from '../state/SecretsView';

let ViewSecretsButtonX: React.FC<{ secretsView: SecretsView }> = ({ secretsView }) => {
  const beenActivated = secretsView.isViewingRoleInfo();
  const activatedStyle = useActivatedStyle();
  return (
    <ToggleButton
      onPress={secretsView.toggleViewingRoleInfo}
      icon={bits.icons.seeSecret.default}
      color={bits.colors.room.passive}
      status={beenActivated ? 'checked' : 'unchecked'}
      style={beenActivated ? activatedStyle : styles.default}
    />
  );
};
ViewSecretsButtonX = observerWithMeta(loggedReactFC()(ViewSecretsButtonX));

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

export default ViewSecretsButtonX;
