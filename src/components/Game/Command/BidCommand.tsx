import React, { useContext, useCallback } from 'react';
import { observerWithMeta } from 'src/library/helpers/mobxHelp';
import { GameContext, RoundContext } from '../GameContexts';
import { loggedReactFC } from 'src/library/logging/loggers';
import { Button, Text, View } from 'src/library/ui/components';
import styles from './CommandStyles';
import { useColors, useFancyText, useIcons } from 'src/components/bits';

let BidCommandX: React.FC = () => {
  const { act, info } = useContext(GameContext).gameApi;
  const [i, j] = useContext(RoundContext).missionAndRoundIndices;
  const bidSuccess = useCallback(() => act!.submitBid(i, j, 'success'), [act, i, j]);
  const bidFail = useCallback(() => act!.submitBid(i, j, 'fail'), [act, i, j]);
  const attr = act && info.getMissionRoundPlayerAttributes(i, j, act.playerIndex);

  const colors = useColors();
  const fancyText = useFancyText();
  const icons = useIcons();
  const rejected = info.getMissionRoundVoteOutcome(i, j) === 'reject' && (
    <Text style={styles.text}>
      The {fancyText.team} proposal was rejected by {fancyText.vote}.
    </Text>
  );
  return !!!rejected ? (
    act ? (
      <>
        <View style={styles.instructions}>
          {attr && attr.inTeam ? (
            <Text style={styles.text}>
              You are on the {fancyText.mission} {fancyText.team}. Play your {fancyText.bid}.
            </Text>
          ) : (
            <Text style={styles.text}>
              Waiting for the {fancyText.team}'s {fancyText.bid} results...
            </Text>
          )}
        </View>
        <View style={styles.actions}>
          {attr && attr.bid ? (
            <Text style={styles.text}>You already submitted your {fancyText.bid}.</Text>
          ) : act.canSubmitBid(i, j) ? (
            <View style={styles.actions}>
              <Button
                icon={icons.success.default}
                color={colors.good.default}
                onPress={bidSuccess}
                disabled={!!!act.canSubmitBid(i, j, 'success')}
              >
                success
              </Button>
              <Button
                icon={icons.fail.default}
                color={colors.evil.default}
                onPress={bidFail}
                disabled={!!!act.canSubmitBid(i, j, 'fail')}
              >
                fail
              </Button>
            </View>
          ) : null}
        </View>
      </>
    ) : (
      <View style={styles.spectating}>
        <Text style={styles.text}>
          The people on the {fancyText.team} are submitting their {fancyText.bid}s for the{' '}
          {fancyText.mission}.
        </Text>
      </View>
    )
  ) : act ? (
    <>
      <View style={styles.instructions}>{rejected}</View>
      <View style={styles.actions} />
    </>
  ) : (
    <View style={styles.spectating}>{rejected}</View>
  );
};
BidCommandX = observerWithMeta(loggedReactFC()(BidCommandX));

export default BidCommandX;
