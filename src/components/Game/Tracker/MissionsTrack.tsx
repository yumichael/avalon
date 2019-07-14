import React, { useContext } from 'react';
import { observerWithMeta } from 'src/library/helpers/mobxHelp';
import { GameContext } from '../GameContexts';
import RoundView from '../state/RoundView';
import Game from 'src/model/Game/Game';
import MissionStampX from './MissionStamp';
import { loggedReactFC } from 'src/library/logging/loggers';
import { StyleSheet, View } from 'src/library/ui/components';

let MissionsTrackX: React.FC<{ roundView: RoundView }> = ({ roundView }) => {
  const { info } = useContext(GameContext).gameApi;
  return (
    <View style={styles.default}>
      {Game.Mission.Index.range(info.getMissionCount()).map(i => (
        <MissionStampX roundView={roundView} missionIndex={i} key={i} />
      ))}
    </View>
  );
};
MissionsTrackX = observerWithMeta(loggedReactFC()(MissionsTrackX));

const styles = StyleSheet.create({
  default: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
});

export default MissionsTrackX;
