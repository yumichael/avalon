import React, { useContext } from 'react';
import { GameContext, RoundContext } from '../GameContexts';
import ChoosingTeamCommandX from './ChoosingTeamCommand';
import VoteCommandX from './VoteCommand';
import BidCommandX from './BidCommand';
import { loggedReactFC } from 'src/library/logging/loggers';
import { observerWithMeta } from 'src/library/helpers/mobxHelp';
import { StyleSheet, View } from 'src/library/ui/components';
import MissionFinishedCommandX from './MissionFinishedCommand';

let GameCommandX: React.FC = () => {
  const { info } = useContext(GameContext).gameApi;
  const [i, j] = useContext(RoundContext).missionAndRoundIndices;
  const progress = info.getMissionRoundProgress(i, j);
  const progressState = progress[progress.length - 1];
  const CommandX = {
    choosingTeam: ChoosingTeamCommandX,
    decidedTeam: VoteCommandX,
    finishedVoting: BidCommandX,
    finishedMission: MissionFinishedCommandX,
  }[progressState];
  return (
    <View style={styles.default}>
      <CommandX key={progressState} />
    </View>
  );
};
GameCommandX = observerWithMeta(loggedReactFC()(GameCommandX));

const styles = StyleSheet.create({
  default: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default GameCommandX;
