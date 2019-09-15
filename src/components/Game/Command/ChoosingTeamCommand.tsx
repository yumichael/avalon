import React, { useContext, useCallback } from 'react';
import { observerWithMeta } from 'src/library/helpers/mobxHelp';
import { GameContext, RoundContext } from '../GameContexts';
import { loggedReactFC } from 'src/library/logging/loggers';
import { Text, View, Button } from 'src/library/ui/components';
import styles from '../../Room/Command/CommandStyles';
import { useFancyText, useIcons, useColors } from 'src/components/bits';

let ChoosingTeamCommandX: React.FC = () => {
  const { info, act } = useContext(GameContext).gameApi;
  const [i, j] = useContext(RoundContext).missionAndRoundIndices;
  const teamSize = info.getTeamSizeForMission(i);
  const remainingSize = teamSize - (info.getMissionRoundWorkingTeamSize(i, j) || 0);
  const peopleString =
    remainingSize === teamSize ? 'people' : remainingSize > 1 ? 'more people' : 'more person';
  const decide = useCallback(() => act!.decideOnTeam(i, j), [act, i, j]);

  const colors = useColors();
  const fancyText = useFancyText();
  const icons = useIcons();
  return act ? (
    <>
      <View style={styles.instructions}>
        {act.canChooseTeam(i, j) ? (
          remainingSize ? (
            <Text style={styles.text}>
              {fancyText.CHOOSE} {remainingSize} {peopleString} to go on the {fancyText.mission}.
            </Text>
          ) : (
            <Text style={styles.text}>
              Is this the {fancyText.team} you want to go on the {fancyText.mission}?
            </Text>
          )
        ) : (
          <Text style={styles.text}>
            Waiting for the {fancyText.leader} to choose a {fancyText.team} of {teamSize} people to
            go on the {fancyText.mission}.
          </Text>
        )}
      </View>
      <View style={styles.actions}>
        {act.canDecideOnTeam(i, j) ? (
          <Button icon={icons.leader.default} color={colors.leader.active} onPress={decide}>
            confirm team
          </Button>
        ) : null}
      </View>
    </>
  ) : (
    <View style={styles.spectating}>
      <Text style={styles.text}>
        This round's {fancyText.leader} is choosing a {fancyText.team} to go on the{' '}
        {fancyText.mission}.
      </Text>
    </View>
  );
};
ChoosingTeamCommandX = observerWithMeta(loggedReactFC()(ChoosingTeamCommandX));

export default ChoosingTeamCommandX;
