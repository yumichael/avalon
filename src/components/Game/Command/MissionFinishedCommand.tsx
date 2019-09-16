import React, { useContext } from 'react';
import { observerWithMeta } from 'src/library/helpers/mobxHelp';
import { GameContext, RoundContext } from '../GameContexts';
import { loggedReactFC } from 'src/library/logging/loggers';
import { Text, View } from 'src/library/ui/components';
import styles from '../../Room/Command/CommandStyles';
import bits from 'src/components/bits';

let MissionFinishedCommandX: React.FC = () => {
  const { info } = useContext(GameContext).gameApi;
  const [i, j] = useContext(RoundContext).missionAndRoundIndices;
  const result = info.getMissionResultFromRound(i, j);

  const { fancyText } = bits;
  return (
    <View style={styles.spectating}>
      <Text style={styles.text}>
        The {fancyText.team} submitted {result && result.successBidCount} {fancyText.success}es and{' '}
        {result && result.failBidCount} {fancyText.fail}s, which means the mission was a{' '}
        {result && fancyText[result.outcome]}.
      </Text>
    </View>
  );
};
MissionFinishedCommandX = observerWithMeta(loggedReactFC()(MissionFinishedCommandX));

export default MissionFinishedCommandX;
