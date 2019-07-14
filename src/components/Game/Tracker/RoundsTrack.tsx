import React, { useContext } from 'react';
import { observerWithMeta } from 'src/library/helpers/mobxHelp';
import { GameContext } from '../GameContexts';
import RoundView from '../state/RoundView';
import Game from 'src/model/Game/Game';
import RoundStampX from './RoundStamp';
import { loggedReactFC } from 'src/library/logging/loggers';
import { StyleSheet, View } from 'src/library/ui/components';

let RoundsTrackX: React.FC<{ roundView: RoundView }> = ({ roundView }) => {
  const { info } = useContext(GameContext).gameApi;
  const [i]: [
    Game.Mission.Index,
    Game.Mission.Round.Index | undefined,
  ] = roundView.getProperIndices(info);
  return (
    <View style={styles.default}>
      {Game.Mission.Round.Index.range(info.getRoundCountForMission(i)).map(j => (
        <RoundStampX roundView={roundView} missionIndex={i} roundIndex={j} key={j} />
      ))}
    </View>
  );
};
RoundsTrackX = observerWithMeta(loggedReactFC()(RoundsTrackX));

const styles = StyleSheet.create({
  default: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
});

export default RoundsTrackX;
