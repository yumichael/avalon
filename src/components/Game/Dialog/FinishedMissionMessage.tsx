import React, { useContext } from 'react';
import { observerWithMeta } from 'src/library/helpers/mobxHelp';
import { GameContext, RoundContext } from '../GameContexts';
import { loggedReactFC } from 'src/library/logging/loggers';
import { Text, StyleSheet } from 'src/library/ui/components';

let FinishedMissionMessageX: React.FC = () => {
  const { info } = useContext(GameContext).gameApi;
  const [i, j] = useContext(RoundContext).missionAndRoundIndices;
  const result = info.getMissionResultFromRound(i, j);
  return (
    <Text style={styles.default}>
      The mission is complete! There were {result && result.successBidCount} successes and{' '}
      {result && result.failBidCount} fails, which means the mission was a{' '}
      {result && result.outcome}.
    </Text>
  );
};
FinishedMissionMessageX = observerWithMeta(loggedReactFC()(FinishedMissionMessageX));

const styles = StyleSheet.create({
  default: {},
});

export default FinishedMissionMessageX;
