import React, { useContext, ReactElement } from 'react';
import { observerWithMeta } from 'src/library/helpers/mobxHelp';
import { GameContext, RoundContext } from '../GameContexts';
import AwaitTeamMessageX from './AwaitTeamMessage';
import RejectedVoteMessageX from './RejectedVoteMessage';
import FinishedMissionMessageX from './FinishedMissionMessage';
import AwaitBidsMessageX from './AwaitBidsMessage';
import FinishedGameMessageX from './FinishedGameMessage';
import isEqual from 'lodash/isEqual';
import { loggedReactFC } from 'src/library/logging/loggers';
import { StyleSheet, View } from 'src/library/ui/components';
import AwaitVoteMessageX from './AwaitVoteMessage';

let GameDialogX: React.FC = () => {
  const { info } = useContext(GameContext).gameApi;
  const [i, j] = useContext(RoundContext).missionAndRoundIndices;
  const progress = info.getMissionRoundProgress(i, j);
  const progressState = progress[progress.length - 1];
  const messages: ReactElement[] = [];
  switch (progressState) {
    case 'choosingTeam':
      messages.push(<AwaitTeamMessageX key="AwaitTeam" />);
      break;
    case 'decidedTeam':
      messages.push(<AwaitVoteMessageX key="Vote" />);
      break;
    case 'finishedVoting':
      const vote = info.getMissionRoundVoteOutcome(i, j);
      if (vote === 'reject') {
        messages.push(<RejectedVoteMessageX key="RejectedVote" />);
      } else {
        messages.push(<AwaitBidsMessageX key="AwaitBids" />);
      }
      break;
    case 'finishedMission':
      messages.push(<FinishedMissionMessageX key="FinishedMissionDialog" />);
      break;
  }
  if (isEqual([i, j], info.getLatestMissionAndRoundIndices()) && info.getWinningFaction()) {
    messages.push(<FinishedGameMessageX key="FinishedGameDialog" />);
  }
  return <View style={styles.default}>{messages}</View>;
};
GameDialogX = observerWithMeta(loggedReactFC()(GameDialogX));

const styles = StyleSheet.create({
  default: {
    flex: 1,
    // width: '100%',
    padding: 10,
  },
});

export default GameDialogX;
