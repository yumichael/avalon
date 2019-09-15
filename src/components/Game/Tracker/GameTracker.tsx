import React from 'react';
import { observerWithMeta } from 'src/library/helpers/mobxHelp';
import RoundView from '../state/RoundView';
import MissionsTrackX from './MissionsTrack';
import RoundsTrackX from './RoundsTrack';
import { loggedReactFC } from 'src/library/logging/loggers';
import { StyleSheet, View } from 'src/library/ui/components';

let GameTrackerX: React.FC<{ roundView: RoundView }> = ({ roundView }) => {
  return (
    <View style={styles.default}>
      <MissionsTrackX roundView={roundView} />
      <RoundsTrackX roundView={roundView} />
    </View>
  );
};
GameTrackerX = observerWithMeta(loggedReactFC()(GameTrackerX));

const styles = StyleSheet.create({
  default: {
    flex: 1,
    // padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default GameTrackerX;
