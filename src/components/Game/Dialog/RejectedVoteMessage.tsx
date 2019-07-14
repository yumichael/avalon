import React from 'react';
import { observerWithMeta } from 'src/library/helpers/mobxHelp';
import { loggedReactFC } from 'src/library/logging/loggers';
import { Text, StyleSheet } from 'src/library/ui/components';

let RejectedVoteMessageX: React.FC = () => {
  return <Text style={styles.default}>The team proposal was rejected. On to the next leader!</Text>;
};
RejectedVoteMessageX = observerWithMeta(loggedReactFC()(RejectedVoteMessageX));

const styles = StyleSheet.create({
  default: {},
});

export default RejectedVoteMessageX;
