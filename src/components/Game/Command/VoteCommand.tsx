import React, { useContext, useCallback } from 'react';
import { observerWithMeta } from 'src/library/helpers/mobxHelp';
import { GameContext, RoundContext } from '../GameContexts';
import { loggedReactFC } from 'src/library/logging/loggers';
import { View, Text, Button } from 'src/library/ui/components';
import styles from '../../Room/Command/CommandStyles';
import bits from 'src/components/bits';

let VoteCommandX: React.FC = () => {
  const { act, info } = useContext(GameContext).gameApi;
  const [i, j] = useContext(RoundContext).missionAndRoundIndices;
  const voteApprove = useCallback(() => act!.submitVote(i, j, 'approve'), [act, i, j]);
  const voteReject = useCallback(() => act!.submitVote(i, j, 'reject'), [act, i, j]);
  const attr = act && info.getMissionRoundPlayerAttributes(i, j, act.playerIndex);

  const { colors, fancyText } = bits;
  return act ? (
    <>
      <View style={styles.instructions}>
        <Text style={styles.text}>
          Do you want this {fancyText.team} to go on the {fancyText.mission}?
        </Text>
      </View>
      <View style={styles.actions}>
        {attr && attr.vote ? (
          <Text style={styles.text}>You already {fancyText.vote}d.</Text>
        ) : act.canSubmitVote(i, j) ? (
          <View style={styles.actions}>
            <Button
              icon="radio-button-unchecked"
              color={colors.approve.default}
              onPress={voteApprove}
              disabled={!!!act.canSubmitVote(i, j, 'approve')}
            >
              approve
            </Button>
            <Button
              icon="radio-button-unchecked"
              color={colors.reject.default}
              onPress={voteReject}
              disabled={!!!act.canSubmitVote(i, j, 'reject')}
            >
              reject
            </Button>
          </View>
        ) : null}
      </View>
    </>
  ) : (
    <View style={styles.spectating}>
      <Text style={styles.text}>
        Every player needs to {fancyText.vote} whether they approve of this {fancyText.team} or not.
      </Text>
    </View>
  );
};
VoteCommandX = observerWithMeta(loggedReactFC()(VoteCommandX));

export default VoteCommandX;
