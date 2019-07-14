import React from 'react';
import { observerWithMeta } from 'src/library/helpers/mobxHelp';
import { loggedReactFC } from 'src/library/logging/loggers';
import { Text, StyleSheet } from 'src/library/ui/components';

let AwaitVoteMessageX: React.FC = () => {
  return <Text style={styles.default}>Everyone vote whether you approve of this team!</Text>;
};
AwaitVoteMessageX = observerWithMeta(loggedReactFC()(AwaitVoteMessageX));

const styles = StyleSheet.create({
  default: {},
});

export default AwaitVoteMessageX;
