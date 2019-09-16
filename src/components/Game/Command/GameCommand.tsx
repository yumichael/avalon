import React, { useContext, useMemo } from 'react';
import { GameContext, RoundContext } from '../GameContexts';
import ChoosingTeamCommandX from './ChoosingTeamCommand';
import VoteCommandX from './VoteCommand';
import BidCommandX from './BidCommand';
import { loggedReactFC } from 'src/library/logging/loggers';
import { observerWithMeta } from 'src/library/helpers/mobxHelp';
import { StyleSheet, View, TouchableRipple } from 'src/library/ui/components';
import MissionFinishedCommandX from './MissionFinishedCommand';
import bits from 'src/components/bits';
import { ViewStyle } from 'react-native';
import RoundView from '../state/RoundView';

let GameCommandX: React.FC<{ roundView: RoundView }> = ({ roundView }) => {
  const { info } = useContext(GameContext).gameApi;
  const [i, j] = useContext(RoundContext).missionAndRoundIndices;
  const [iLatest, jLatest] = info.getLatestMissionAndRoundIndices();
  const progress = info.getMissionRoundProgress(i, j);
  const progressState = progress[progress.length - 1];
  const CommandX = {
    choosingTeam: ChoosingTeamCommandX,
    decidedTeam: VoteCommandX,
    finishedVoting: BidCommandX,
    finishedMission: MissionFinishedCommandX,
  }[progressState];

  const moveOnStyle = useMoveOnStyle();
  const shouldMoveOn: boolean = !!!info.getGameFinish() && (i !== iLatest || j !== jLatest);
  const element = (
    <View style={shouldMoveOn ? moveOnStyle : styles.default}>
      <CommandX key={progressState} />
    </View>
  );
  return shouldMoveOn ? (
    <TouchableRipple onPress={roundView.setCurrent} style={styles.touch}>
      {element}
    </TouchableRipple>
  ) : (
    element
  );
};
GameCommandX = observerWithMeta(loggedReactFC()(GameCommandX));

const styles = StyleSheet.create({
  default: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 1,
  },
  touch: {
    flex: 1,
  },
});
function useMoveOnStyle() {
  return useMemo<ViewStyle>(
    () => ({
      ...styles.default,
      borderWidth: 1,
      padding: 0,
      borderColor: bits.colors.concern.active,
    }),
    [bits.colors],
  );
}

export default GameCommandX;
