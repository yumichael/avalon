import React, { useContext, useCallback } from 'react';
import { observerWithMeta } from 'src/library/helpers/mobxHelp';
import { GameContext } from '../GameContexts';
import RoundView from '../state/RoundView';
import Game from 'src/model/Game/Game';
import { loggedReactFC } from 'src/library/logging/loggers';
import { StyleSheet, View, ToggleButton } from 'src/library/ui/components';
import bits from 'src/components/bits';

let RoundStampX: React.FC<{
  roundView: RoundView;
  missionIndex: Game.Mission.Index;
  roundIndex: Game.Mission.Index;
}> = ({ roundView, missionIndex: i, roundIndex: j }) => {
  const { info } = useContext(GameContext).gameApi;
  const [iViewing, jViewing] = roundView.getIndices();
  let shouldReturnNothing: boolean = false; // Need this to have the React hooks always run.
  if (i !== iViewing) {
    shouldReturnNothing = true;
  }
  const jLatest = info.getLatestMissionRoundIndex(i);
  if (jLatest === undefined) {
    shouldReturnNothing = true;
  }
  const viewRound = useCallback(() => roundView.setRound(j), [roundView, j]);
  const voteOutcome = info.getMissionRoundVoteOutcome(i, j);
  const theRoundCountForMission = info.getRoundCountForMission(i);

  // TODO remove commented out code.
  // const countIcon = useCallback(
  //   ({ size, color }: { size?: number; color?: string }) => (
  //     <Text style={{ fontSize: size, color }}>{j + 1}</Text>
  //   ),
  //   [i],
  // );
  const { colors, alphas, icons } = bits;
  // const viewingStyle = useViewingStyle();
  return (
    <View style={styles.default}>
      {/*j === jViewing ? <View style={viewingStyle} /> : null*/
      /* TODO get rid of commented out code in this file */}
      {shouldReturnNothing ? null : (
        <ToggleButton
          icon={j < theRoundCountForMission - 1 ? icons.aRound.default : icons.lastRound.default}
          color={
            voteOutcome
              ? colors[voteOutcome].default
              : j === jLatest
              ? colors.concern.active
              : j < theRoundCountForMission - 1
              ? colors.concern.passive + alphas.future.default
              : colors.concern.passive + alphas.future.default
          }
          onPress={viewRound}
          size={(bits.constSizes.screenHeight / 812) * 27}
          status={j === jViewing ? 'checked' : 'unchecked'}
          disabled={j > jLatest!}
          style={styles.selection}
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
  selection: {
    width: (bits.constSizes.screenHeight / 812) * 38,
    height: (bits.constSizes.screenHeight / 812) * 38,
  },
});
// function useViewingStyle() {
//   const colors = useColors();
//   const alphas = useAlphas();
//   return useMemo<ViewStyle>(
//     () => ({
//       alignSelf: 'center',
//       position: 'absolute',
//       height: 32,
//       width: 32,
//       backgroundColor: colors.room.passive + alphas.highlight.default,
//       borderWidth: 1,
//       borderColor: colors.room.passive,
//       zIndex: -1,
//     }),
//     [colors, alphas],
//   );
// }

export default RoundStampX;
