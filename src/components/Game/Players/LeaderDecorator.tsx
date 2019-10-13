import React, { useContext } from 'react';
import { observerWithMeta } from 'src/library/helpers/mobxHelp';
import { GameContext, RoundContext, PlayerContext } from '../GameContexts';
import { loggedReactFC } from 'src/library/logging/loggers';
import { StyleSheet, View, IconButton } from 'src/library/ui/components';
import bits from 'src/components/bits';

let LeaderDecoratorX: React.FC = () => {
  const { info } = useContext(GameContext).gameApi;
  const [i, j] = useContext(RoundContext).missionAndRoundIndices;
  const { playerIndex: k } = useContext(PlayerContext);

  const { colors, icons } = bits;
  return (
    <View style={styles.anchor}>
      <View style={styles.default}>
        {k === info.getMissionRoundLeader(i, j) ? (
          <IconButton
            icon={icons.leader.default}
            color={colors.leader.passive}
            size={(bits.constSizes.screenHeight / 812) * 36}
          />
        ) : null}
      </View>
    </View>
  );
};
LeaderDecoratorX = observerWithMeta(loggedReactFC()(LeaderDecoratorX));

const styles = StyleSheet.create({
  default: {
    // position: 'absolute',
    left: 0,
    top: 0,
  },
  anchor: {
    position: 'absolute',
    alignSelf: 'center',
    height: (bits.constSizes.screenHeight / 812) * 100,
    width: (bits.constSizes.screenHeight / 812) * 100,
  },
});

export default LeaderDecoratorX;
