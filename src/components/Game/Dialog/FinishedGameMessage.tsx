import React, { useContext } from 'react';
import { observerWithMeta } from 'src/library/helpers/mobxHelp';
import { GameContext } from '../GameContexts';
import { loggedReactFC } from 'src/library/logging/loggers';
import { Text, StyleSheet } from 'src/library/ui/components';

let FinishedGameMessageX: React.FC = () => {
  const { info } = useContext(GameContext).gameApi;
  const winner = info.getWinningFaction();
  return (
    <Text style={styles.default}>
      {winner ? `Congratulations to team ***${winner}*** for winning the game!` : null}
    </Text>
  );
};
FinishedGameMessageX = observerWithMeta(loggedReactFC()(FinishedGameMessageX));

const styles = StyleSheet.create({
  default: {},
});

export default FinishedGameMessageX;
