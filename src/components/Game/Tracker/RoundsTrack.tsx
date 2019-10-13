import React, { useContext, useMemo } from 'react';
import { observerWithMeta } from 'src/library/helpers/mobxHelp';
import { GameContext } from '../GameContexts';
import RoundView from '../state/RoundView';
import Game from 'src/model/Game/Game';
import RoundStampX from './RoundStamp';
import { loggedReactFC } from 'src/library/logging/loggers';
import { StyleSheet, View } from 'src/library/ui/components';
import { useStampPropsMap } from './MissionStamp';
import bits from 'src/components/bits';

let RoundsTrackX: React.FC<{ roundView: RoundView }> = ({ roundView }) => {
  const { info } = useContext(GameContext).gameApi;
  const [i]: [Game.Mission.Index, Game.Mission.Round.Index] = roundView.getIndices();
  const result = info.getMissionResult(i);
  const outcome = result && result.outcome;

  const iLatest = info.getLatestMissionIndex();
  const stampProps = useStampPropsMap()[
    i <= iLatest
      ? outcome === 'success'
        ? 'success'
        : outcome === 'fail'
        ? 'fail'
        : 'current'
      : 'future'
  ];
  const { alphas } = bits;
  const roundsStyle = useMemo(
    () => ({ ...styles.default, borderColor: stampProps.color + alphas.helping.default }),
    [stampProps],
  );
  return (
    <View style={roundsStyle}>
      {Game.Mission.Round.Index.range(info.getRoundCountForMission(i)).map(j => (
        <RoundStampX roundView={roundView} missionIndex={i} roundIndex={j} key={j} />
      ))}
    </View>
  );
};
RoundsTrackX = observerWithMeta(loggedReactFC()(RoundsTrackX));

const styles = StyleSheet.create({
  default: {
    // padding: 2,
    // flex: 0.44,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    borderWidth: 1,
    borderRadius: 8,
  },
});

export default RoundsTrackX;
