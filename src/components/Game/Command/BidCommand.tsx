import React, { useContext, useCallback, useState, useEffect } from 'react';
import { observerWithMeta } from 'src/library/helpers/mobxHelp';
import { GameContext, RoundContext } from '../GameContexts';
import { loggedReactFC } from 'src/library/logging/loggers';
import { Button, Text, View } from 'src/library/ui/components';
import styles from '../../Room/Command/CommandStyles';
import bits from 'src/components/bits';

let BidCommandX: React.FC = () => {
  const { colors, icons, fancyText, timeDurations } = bits;

  const { act, info } = useContext(GameContext).gameApi;
  const [i, j] = useContext(RoundContext).missionAndRoundIndices;
  const bidSuccess = useCallback(() => act!.submitBid(i, j, 'success'), [act, i, j]);
  const bidFail = useCallback(() => act!.submitBid(i, j, 'fail'), [act, i, j]);
  const attr = act && info.getMissionRoundPlayerAttributes(i, j, act.playerIndex);

  const [bidsReveal, setBidsReveal] = useState<null | 1 | 2>(null);
  const revealBids = useCallback(
    () => setBidsReveal((1 + Math.floor(Math.random() * 2)) as 1 | 2),
    [setBidsReveal],
  );
  useEffect(() => {
    if (bidsReveal) {
      const timeout = setTimeout(() => setBidsReveal(null), timeDurations.viewBids);
      return () => {
        clearTimeout(timeout);
      };
    }
    return undefined;
  }, [bidsReveal, setBidsReveal]);

  const rejected = info.getMissionRoundVoteOutcome(i, j) === 'reject' && (
    <Text style={styles.text}>
      The {fancyText.team} proposal was rejected by {fancyText.vote}.
    </Text>
  );
  const buttons = [
    <Button
      key="success"
      icon={icons.success.default}
      color={colors.good.default}
      onPress={bidSuccess}
      disabled={!!!act!.canSubmitBid(i, j, 'success')}
    >
      success
    </Button>,
    <Button
      key="fail"
      icon={icons.fail.default}
      color={colors.evil.default}
      onPress={bidFail}
      disabled={!!!act!.canSubmitBid(i, j, 'fail')}
    >
      fail
    </Button>,
  ];
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
            bidsReveal ? (
              <View style={styles.actions}>
                {buttons[2 - bidsReveal]}
                {buttons[bidsReveal - 1]}
              </View>
            ) : (
              <View style={styles.actions}>
                <Button
                  key="reveal"
                  icon={icons.seeSecret.default}
                  color={colors.team.default}
                  onPress={revealBids}
                >
                  reveal shuffled bids
                </Button>
              </View>
            )
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
  ) : (
    <View style={styles.spectating}>{rejected}</View>
  );
};
BidCommandX = observerWithMeta(loggedReactFC()(BidCommandX));

export default BidCommandX;
