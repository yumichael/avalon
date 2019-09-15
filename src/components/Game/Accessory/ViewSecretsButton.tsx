import React from 'react';
import { observerWithMeta } from 'src/library/helpers/mobxHelp';
import { loggedReactFC } from 'src/library/logging/loggers';
import { StyleSheet, ToggleButton } from 'src/library/ui/components';
import { useColors } from 'src/components/bits';
import SecretsView from '../state/SecretsView';

let ViewSecretsButtonX: React.FC<{ secretsView: SecretsView }> = ({ secretsView }) => {
  const colors = useColors();
  return (
    <ToggleButton
      onPress={secretsView.toggleViewingRoleInfo}
      icon="visibility"
      color={colors.room.passive}
      status={secretsView.isViewingRoleInfo() ? 'checked' : 'unchecked'}
      style={styles.default}
    />
  );
};
ViewSecretsButtonX = observerWithMeta(loggedReactFC()(ViewSecretsButtonX));

const styles = StyleSheet.create({
  default: {},
});

export default ViewSecretsButtonX;
