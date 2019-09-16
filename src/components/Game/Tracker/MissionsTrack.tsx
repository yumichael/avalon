import React, { useContext, useMemo } from 'react';
import { observerWithMeta } from 'src/library/helpers/mobxHelp';
import { GameContext } from '../GameContexts';
import RoundView from '../state/RoundView';
import Game from 'src/model/Game/Game';
import MissionStampX, { useStampPropsMap } from './MissionStamp';
import { loggedReactFC } from 'src/library/logging/loggers';
import { StyleSheet, View } from 'src/library/ui/components';
import bits from 'src/components/bits';

let MissionsTrackX: React.FC<{ roundView: RoundView }> = ({ roundView }) => {
  const { info } = useContext(GameContext).gameApi;
  const [iViewing]: [Game.Mission.Index, Game.Mission.Round.Index] = roundView.getIndices();
  const result = info.getMissionResult(iViewing);
  const outcome = result && result.outcome;

  const iLatest = info.getLatestMissionIndex();
  const stampProps = useStampPropsMap()[
    iViewing <= iLatest
      ? outcome === 'success'
        ? 'success'
        : outcome === 'fail'
        ? 'fail'
        : 'current'
      : 'future'
  ];
  const { alphas } = bits;
  const trackStyle = useMemo(
    () => ({ ...styles.default, borderBottomColor: stampProps.color + alphas.helping.default }),
    [stampProps],
  );

  return (
    <View style={trackStyle}>
      {Game.Mission.Index.range(info.getMissionCount()).map(i => (
        <MissionStampX roundView={roundView} missionIndex={i} key={i} />
      ))}
    </View>
  );
};
MissionsTrackX = observerWithMeta(loggedReactFC()(MissionsTrackX));

const styles = StyleSheet.create({
  default: {
    padding: 2,
    // flex: 0.56,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    borderBottomWidth: 1,
    borderRadius: 5,
  },
});

export default MissionsTrackX;
