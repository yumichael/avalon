import React, { useContext, useCallback, useMemo, ReactElement } from 'react';
import { observerWithMeta } from 'src/library/helpers/mobxHelp';
import { GameContext } from '../GameContexts';
import RoundView from '../state/RoundView';
import Game from 'src/model/Game/Game';
import { loggedReactFC } from 'src/library/logging/loggers';
import { StyleSheet, View, ToggleButton, Badge, Text, IconButton } from 'src/library/ui/components';
import bits from 'src/components/bits';
import { ViewStyle } from 'react-native';
import range from 'lodash/range';

let MissionStampX: React.FC<{
  roundView: RoundView;
  missionIndex: Game.Mission.Index;
}> = ({ roundView, missionIndex: i }) => {
  const { info } = useContext(GameContext).gameApi;
  const [iViewing] = roundView.getIndices();
  const iLatest = info.getLatestMissionIndex();
  const j = info.getLatestMissionRoundIndex(i);
  const viewMission = useCallback(() => roundView.setMission(i), [roundView, i]);
  const vote = j !== undefined ? info.getMissionRoundVoteOutcome(i, j) : undefined;
  const result = info.getMissionResult(i);
  const outcome = result && result.outcome;

  const stampProps = useStampPropsMap()[
    i <= iLatest
      ? outcome === 'success'
        ? 'success'
        : outcome === 'fail'
        ? 'fail'
        : 'current'
      : 'future'
  ];
  const peopleStyle = usePeopleStyle();
  const bidsDisplay = useBidsDisplay(
    info.getTeamSizeForMission(i),
    info.getFailingBidCountForMission(i),
    vote,
    result,
  );
  const { alphas } = bits;
  // const viewingStyle = useViewingStyle();
  return (
    <View style={styles.default}>
      {i === iViewing ? (
        <IconButton
          icon="arrow-drop-up"
          color={stampProps.color + alphas.helping.default}
          style={styles.expander}
        />
      ) : null}
      <Badge size={11} style={peopleStyle} children={bidsDisplay} />
      {/*i === iViewing ? <View style={viewingStyle} /> : null*/
      /* TODO get rid of commented out code in this file */}
      <ToggleButton
        icon={stampProps.icon}
        color={stampProps.color}
        onPress={viewMission}
        status={i === iViewing ? 'checked' : 'unchecked'}
        disabled={i > iLatest}
        style={styles.selection}
      />
    </View>
  );
};
MissionStampX = observerWithMeta(loggedReactFC()(MissionStampX));

const styles = StyleSheet.create({
  default: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  people: {
    alignSelf: 'center',
    // position: 'absolute',
    // top: 0,
  },
  selection: {
    width: 38,
    height: 38,
    // position: 'absolute',
    // bottom: 0,
  },
  expander: {
    position: 'absolute',
    bottom: -24,
    alignSelf: 'center',
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
function usePeopleStyle() {
  const { colors } = bits;
  return useMemo<ViewStyle>(
    () => ({
      alignSelf: 'center',
      backgroundColor: colors.leader.passive,
    }),
    [colors],
  );
}

export function useStampPropsMap() {
  const { colors, icons } = bits;
  return useMemo(
    () => ({
      success: { icon: icons.success.default, color: colors.good.default },
      fail: { icon: icons.fail.default, color: colors.evil.default },
      current: { icon: icons.currentMission.default, color: colors.concern.active },
      future: { icon: icons.futureMission.default, color: colors.concern.passive },
    }),
    [colors, icons],
  );
}
function useBidStyles() {
  const { colors } = bits;
  return useMemo(
    () => ({
      success: { color: colors.good.default },
      fail: { color: colors.evil.default },
      current: { color: colors.concern.active },
      ignored: { color: colors.concern.passive },
      future: {},
    }),
    [colors],
  );
}
const wantBid = '⬤';
const tossBid = <Text style={{ fontWeight: 'bold' }}>―</Text>;
function useBidsDisplay(
  teamSize: number,
  failingCount: number,
  vote: 'approve' | 'reject' | undefined,
  result: Game.Mission.Result | undefined,
) {
  const bidStyles = useBidStyles();

  return useMemo(() => {
    const bidHints: Array<'success' | 'fail' | 'current' | 'ignored' | 'future'> = Array(teamSize);
    if (vote !== 'approve') {
      bidHints.fill('future');
    } else if (!!!result) {
      bidHints.fill('current');
    } else {
      bidHints.fill('success', 0, result.successBidCount);
      bidHints.fill('fail', result.successBidCount, result.successBidCount + result.failBidCount);
    }

    const output: ReactElement[] = [];
    for (const i of range(teamSize)) {
      if (output.length !== 0) {
        // tslint:disable-next-line: jsx-self-close // It's a space.
        output.push(<Text key={i - 0.5}> </Text>);
      }
      output.push(
        <Text key={i} style={bidStyles[bidHints[i]]}>
          {teamSize - i >= failingCount ? wantBid : tossBid}
        </Text>,
      );
    }
    return output;
  }, [teamSize, failingCount, vote, result]);
}

export default MissionStampX;
