import React, { useContext, useMemo } from 'react';
import { observerWithMeta } from 'src/library/helpers/mobxHelp';
import { GameContext, PlayerContext } from '../GameContexts';
import { loggedReactFC } from 'src/library/logging/loggers';
import { StyleSheet, View } from 'src/library/ui/components';
import bits from 'src/components/bits';
import Game from 'src/model/Game/Game';

let RoleDecoratorX: React.FC = () => {
  const { info, act } = useContext(GameContext).gameApi;
  const { playerIndex: k } = useContext(PlayerContext);
  const viewingPlayerIndex = act && act.playerIndex;
  const roleView = info.getPlayerRoleView(k, viewingPlayerIndex);
  const faction =
    roleView === 'bodyguardView'
      ? 'either'
      : roleView === null
      ? undefined
      : roleView === 'good' || roleView === 'evil'
      ? roleView
      : Game.Player.Role.factionMap[roleView];

  const colorMap = useColorMap();
  const style = useMemo(
    () => ({
      ...styles.default,
      ...(faction ? { backgroundColor: colorMap[faction] } : {}),
    }),
    [faction],
  );
  return roleView ? <View style={style} /> : null;
};
RoleDecoratorX = observerWithMeta(loggedReactFC()(RoleDecoratorX));

const styles = StyleSheet.create({
  default: {
    alignSelf: 'center',
    position: 'absolute',
    height: 64,
    width: 64,
    borderRadius: 32,
  },
});

function useColorMap() {
  const { colors, alphas } = bits;
  return useMemo(
    () => ({
      good: colors.good.default + alphas.role.default,
      evil: colors.evil.default + alphas.role.default,
      either: colors.concern.active + alphas.role.default,
    }),
    [colors, alphas],
  );
}

export default RoleDecoratorX;
