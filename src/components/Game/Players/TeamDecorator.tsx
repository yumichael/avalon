import React, { useContext, useCallback, useMemo } from 'react';
import { observerWithMeta } from 'src/library/helpers/mobxHelp';
import { GameContext, RoundContext, PlayerContext } from '../GameContexts';
import { loggedReactFC } from 'src/library/logging/loggers';
import { View, StyleSheet, IconButton } from 'src/library/ui/components';
import bits from 'src/components/bits';
import { ViewStyle } from 'react-native';

let TeamDecoratorX: React.FC = () => {
  const { act, info } = useContext(GameContext).gameApi;
  const [i, j] = useContext(RoundContext).missionAndRoundIndices;
  const { playerIndex: k } = useContext(PlayerContext);
  const attr = info.getMissionRoundPlayerAttributes(i, j, k);
  const inTeam = attr && attr.inTeam;
  const toggle = useCallback(() => {
    act!.toggleTeamMember(i, j, k);
    console.log('kkk');
  }, [act, i, j, k]);

  const { colors } = bits;
  const inTeamStyle = useInTeamStyle();
  return (
    <>
      {inTeam ? <View style={inTeamStyle} /> : null}
      {act && act.canToggleTeamMember(i, j, k) ? (
        <IconButton
          icon={inTeam ? 'minus-circle' : 'plus-circle'}
          color={colors.leader.active}
          onPress={toggle}
          style={styles.button}
        />
      ) : null}
    </>
  );
};
TeamDecoratorX = observerWithMeta(loggedReactFC()(TeamDecoratorX));

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: (-bits.constSizes.screenHeight / 812) * 16,
    right: (-bits.constSizes.screenHeight / 812) * 16,
  },
});
function useInTeamStyle() {
  const { colors, alphas, constSizes } = bits;
  return useMemo<ViewStyle>(
    () => ({
      alignSelf: 'center',
      position: 'absolute',
      height: (constSizes.screenHeight / 812) * 84,
      width: (constSizes.screenHeight / 812) * 84,
      backgroundColor: colors.team.default + alphas.highlight.default,
      borderWidth: 1,
      borderColor: colors.team.default,
      zIndex: -1,
    }),
    [colors.team.default, alphas.highlight.default],
  );
}

export default TeamDecoratorX;
