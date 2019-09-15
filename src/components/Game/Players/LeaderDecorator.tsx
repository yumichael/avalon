import React, { useContext } from 'react';
import { observerWithMeta } from 'src/library/helpers/mobxHelp';
import { GameContext, RoundContext, PlayerContext } from '../GameContexts';
import { loggedReactFC } from 'src/library/logging/loggers';
import { StyleSheet, View, IconButton } from 'src/library/ui/components';
import { useIcons, useColors } from 'src/components/bits';

let LeaderDecoratorX: React.FC = () => {
  const { info } = useContext(GameContext).gameApi;
  const [i, j] = useContext(RoundContext).missionAndRoundIndices;
  const { playerIndex: k } = useContext(PlayerContext);

  const colors = useColors();
  const icons = useIcons();
  return (
    <View style={styles.default}>
      {k === info.getMissionRoundLeader(i, j) ? (
        <IconButton icon={icons.leader.default} color={colors.leader.passive} size={36} />
      ) : null}
    </View>
  );
};
LeaderDecoratorX = observerWithMeta(loggedReactFC()(LeaderDecoratorX));

const styles = StyleSheet.create({
  default: {
    position: 'absolute',
    left: -16,
    top: -16,
  },
});

export default LeaderDecoratorX;
