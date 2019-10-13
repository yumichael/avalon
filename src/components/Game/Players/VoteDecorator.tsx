import React, { useContext, useMemo } from 'react';
import { observerWithMeta } from 'src/library/helpers/mobxHelp';
import { GameContext, RoundContext, PlayerContext } from '../GameContexts';
import { loggedReactFC } from 'src/library/logging/loggers';
import { StyleSheet, View } from 'src/library/ui/components';
import bits from 'src/components/bits';

let VoteDecoratorX: React.FC = () => {
  const { info } = useContext(GameContext).gameApi;
  const [i, j] = useContext(RoundContext).missionAndRoundIndices;
  const { playerIndex: k } = useContext(PlayerContext);
  const attr = info.getMissionRoundPlayerAttributes(i, j, k);
  const vote =
    attr && attr.vote ? (info.getMissionRoundVoteOutcome(i, j) ? attr.vote : 'voted') : undefined;

  const colorMap = useColorMap();
  const style = useMemo(
    () => ({
      ...styles.default,
      ...(vote ? { borderColor: colorMap[vote] } : {}),
    }),
    [vote],
  );
  return vote ? <View style={style} /> : null;
};
VoteDecoratorX = observerWithMeta(loggedReactFC()(VoteDecoratorX));

const styles = StyleSheet.create({
  default: {
    alignSelf: 'center',
    position: 'absolute',
    height: (bits.constSizes.screenHeight / 812) * 76,
    width: (bits.constSizes.screenHeight / 812) * 76,
    borderWidth: (bits.constSizes.screenHeight / 812) * 3,
    borderRadius: (bits.constSizes.screenHeight / 812) * 48,
  },
});

function useColorMap() {
  const { colors, alphas } = bits;
  return useMemo(
    () => ({
      voted: colors.leader.passive + alphas.vote.default,
      approve: colors.approve.default + alphas.vote.default,
      reject: colors.reject.default + alphas.vote.default,
    }),
    [colors.leader.passive, colors.approve.default, colors.reject.default, alphas.vote.default],
  );
}

export default VoteDecoratorX;
