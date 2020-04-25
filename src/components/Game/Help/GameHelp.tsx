import React, { useContext, useCallback, useMemo } from 'react';
import { observerWithMeta } from 'src/library/helpers/mobxHelp';
import { loggedReactFC } from 'src/library/logging/loggers';
import { ScrollView, StyleSheet, Text, Button, View } from 'src/library/ui/components';
import bits from 'src/components/bits';
import SecretsView from '../state/SecretsView';
import { GameContext } from '../GameContexts';
import { Linking } from 'react-native';

let GameHelpX: React.FC<{ secretsView: SecretsView }> = ({ secretsView }) => {
  const { gameApi } = useContext(GameContext);
  const { colors, fancyText, icons } = bits;
  const openRules = useCallback(
    () => Linking.openURL('https://en.wikipedia.org/wiki/The_Resistance_(game)'),
    [Linking],
  );
  const containerStyle = useContainerStyle();
  return (
    <View style={containerStyle}>
      <ScrollView style={styles.dialog}>
        <Text>
          <Text style={styles.bold}>Game Help</Text>
          {'\n\n'}
          {fancyText.theGame} is a social deduction game with secret identities. The{' '}
          {fancyText.goodPlayers} must determine the hidden {fancyText.evilPlayers} among them as
          everyone together choose {fancyText.team}s to go on {fancyText.mission}s whose outcome
          will determine the fate of the {fancyText.goodPlayers}. The {fancyText.evilPlayers} must
          hide their identities and gain everyone's trust so they can be chosen to be placed on the{' '}
          {fancyText.team}s for these {fancyText.mission}s and gain the chance to sabotage them.
          {'\n\n'}
          The {fancyText.goodPlayers} wins the game if three {fancyText.mission}s are completed{' '}
          {fancyText.success}fully.
          {'\n\n'}
          The {fancyText.evilPlayers} win if three {fancyText.mission}s {fancyText.fail}.{'\n\n'}A
          fundamental rule of the game is that players may say anything that they want, at anytime
          during the game. You are allowed to say anything, to any one, at any time as long as it is
          said publicly. Discussion, deception, intuition, social interaction and logical deductions
          are all equally important to winning. The only thing you must not do is show your phone
          screen to anyone else.
          {'\n\n'}
          <Text style={styles.hyperlink} onPress={openRules}>
            Link to Detailed Rules
          </Text>
          {'\n'}
        </Text>
      </ScrollView>
      {gameApi.info.getGameFinish() ? null : !!!secretsView.isViewingRoleInfo() ? (
        <Button
          icon={icons.seeSecret.default}
          color={
            !!!gameApi.act || gameApi.act.hasSeenRole()
              ? colors.room.passive
              : colors.concern.active
          }
          onPress={secretsView.viewRoleInfo}
          style={styles.button}
        >
          view role
        </Button>
      ) : (
        <Button
          icon={icons.unseeSecret.default}
          color={colors.room.passive}
          onPress={secretsView.stopViewingRoleInfo}
          style={styles.button}
        >
          close view
        </Button>
      )}
    </View>
  );
};
GameHelpX = observerWithMeta(loggedReactFC()(GameHelpX));

const styles = StyleSheet.create({
  dialog: {
    flex: 1,
  },
  button: {},
  hyperlink: { color: 'blue' },
  bold: { fontWeight: 'bold' },
});
function useContainerStyle() {
  const { constSizes, colors, alphas } = bits;
  return useMemo(
    () => ({
      flex: 1,
      borderWidth: constSizes.presenceBorderWidth,
      borderRadius: constSizes.presenceCurve,
      borderColor: colors.room.passive,
      backgroundColor: colors.presence.active + alphas.helping.default,
    }),
    [
      constSizes.presenceBorderWidth,
      constSizes.presenceCurve,
      colors.room.passive,
      colors.presence.active,
      alphas.helping.default,
    ],
  );
}

export default GameHelpX;
