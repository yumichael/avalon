import React, { useContext, useCallback, useMemo } from 'react';
import { observerWithMeta } from 'src/library/helpers/mobxHelp';
import { GameContext } from '../GameContexts';
import RoundView from '../state/RoundView';
import Game from 'src/model/Game/Game';
import { loggedReactFC } from 'src/library/logging/loggers';
import { StyleSheet, View, IconButton, Text } from 'src/library/ui/components';
import { useColors, useAlphas } from 'src/components/bits';
import { ViewStyle } from 'react-native';

let RoundStampX: React.FC<{
  roundView: RoundView;
  missionIndex: Game.Mission.Index;
  roundIndex: Game.Mission.Index;
}> = ({ roundView, missionIndex: i, roundIndex: j }) => {
  const { info } = useContext(GameContext).gameApi;
  const [iViewing, jViewing] = roundView.getProperIndices(info);
  let shouldReturnNothing: boolean = false; // Need this to have the React hooks always run.
  if (i !== iViewing) {
    shouldReturnNothing = true;
  }
  const jLatest = info.getLatestMissionRoundIndex(i);
  if (jLatest === undefined) {
    shouldReturnNothing = true;
  }
  const jToView = jLatest === j ? 'latest' : j;
  const viewRound = useCallback(() => roundView.setRound(jToView), [roundView, jToView]);
  const voteOutcome = info.getMissionRoundVoteOutcome(i, j);

  const countIcon = useCallback(
    ({ size, color }: { size?: number; color?: string }) => (
      <Text style={{ fontSize: size, color }}>{j + 1}</Text>
    ),
    [i],
  );
  const colors = useColors();
  const alphas = useAlphas();
  const viewingStyle = useViewingStyle();
  return (
    <View style={styles.default}>
      {j === jViewing ? <View style={viewingStyle} /> : null}
      {shouldReturnNothing ? null : (
        <IconButton
          icon={countIcon}
          color={
            voteOutcome
              ? colors[voteOutcome].default
              : j === jLatest
              ? colors.concern.active
              : j < info.getRoundCountForMission(i) - 1
              ? colors.concern.passive + alphas.future.default
              : colors.approve.default + alphas.future.default
          }
          onPress={viewRound}
          disabled={j > jLatest!}
        />
      )}
    </View>
  );
};
RoundStampX = observerWithMeta(loggedReactFC()(RoundStampX));

const styles = StyleSheet.create({
  default: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
function useViewingStyle() {
  const colors = useColors();
  const alphas = useAlphas();
  return useMemo<ViewStyle>(
    () => ({
      alignSelf: 'center',
      position: 'absolute',
      height: 32,
      width: 32,
      backgroundColor: colors.room.passive + alphas.highlight.default,
      borderWidth: 1,
      borderColor: colors.room.passive,
      zIndex: -1,
    }),
    [colors, alphas],
  );
}

export default RoundStampX;
