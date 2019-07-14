import React, { useContext, useCallback, useMemo } from 'react';
import { observerWithMeta } from 'src/library/helpers/mobxHelp';
import { GameContext } from '../GameContexts';
import RoundView from '../state/RoundView';
import Game from 'src/model/Game/Game';
import { loggedReactFC } from 'src/library/logging/loggers';
import { StyleSheet, View, IconButton } from 'src/library/ui/components';
import { useColors, useIcons, useAlphas } from 'src/components/bits';
import { ViewStyle } from 'react-native';

let MissionStampX: React.FC<{
  roundView: RoundView;
  missionIndex: Game.Mission.Index;
}> = ({ roundView, missionIndex: i }) => {
  const { info } = useContext(GameContext).gameApi;
  const [iViewing] = roundView.getProperIndices(info);
  const iLatest = info.getLatestMissionIndex();
  const iToView = iLatest === i ? 'latest' : i;
  const viewMission = useCallback(() => roundView.setMission(iToView), [roundView, iToView]);
  const result = info.getMissionResult(i);
  const outcome = result && result.outcome;

  const iconProps = useIconPropsMap()[
    i <= iLatest
      ? outcome === 'success'
        ? 'success'
        : outcome === 'fail'
        ? 'fail'
        : 'current'
      : 'future'
  ];
  const viewingStyle = useViewingStyle();
  return (
    <View style={styles.default}>
      {i === iViewing ? <View style={viewingStyle} /> : null}
      <IconButton
        icon={iconProps.icon}
        color={iconProps.color}
        onPress={viewMission}
        disabled={i > iLatest}
      />
    </View>
  );
};
MissionStampX = observerWithMeta(loggedReactFC()(MissionStampX));

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

function useIconPropsMap() {
  const colors = useColors();
  const icons = useIcons();
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

export default MissionStampX;
