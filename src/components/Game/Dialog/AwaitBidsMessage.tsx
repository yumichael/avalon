import React from 'react';
import { observerWithMeta } from 'src/library/helpers/mobxHelp';
import { loggedReactFC } from 'src/library/logging/loggers';
import { Text, StyleSheet } from 'src/library/ui/components';

let AwaitBidsMessageX: React.FC = () => {
  return (
    <Text style={styles.default}>
      Waiting for the team members to submit their bids for the mission.
    </Text>
  );
};
AwaitBidsMessageX = observerWithMeta(loggedReactFC()(AwaitBidsMessageX));

const styles = StyleSheet.create({
  default: {},
});

export default AwaitBidsMessageX;
