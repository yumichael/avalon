import React, { useContext } from 'react';
import { observerWithMeta } from 'src/library/helpers/mobxHelp';
import { GameContext, RoundContext } from '../GameContexts';
import { loggedReactFC } from 'src/library/logging/loggers';
import { Text, StyleSheet } from 'src/library/ui/components';

let AwaitTeamMessageX: React.FC = () => {
  const { info } = useContext(GameContext).gameApi;
  const [i] = useContext(RoundContext).missionAndRoundIndices;
  const teamSize = info.getTeamSizeForMission(i);
  return (
    <Text style={styles.default}>
      Waiting for the leader to decide on a team! This mission's team has {teamSize} people.
    </Text>
  );
};
AwaitTeamMessageX = observerWithMeta(loggedReactFC()(AwaitTeamMessageX));

const styles = StyleSheet.create({
  default: {},
});

export default AwaitTeamMessageX;
