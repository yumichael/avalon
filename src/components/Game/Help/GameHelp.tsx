import React, { useContext } from 'react';
import { observerWithMeta } from 'src/library/helpers/mobxHelp';
import { loggedReactFC } from 'src/library/logging/loggers';
import { ScrollView, StyleSheet, Text, Button } from 'src/library/ui/components';
import { useColors } from 'src/components/bits';
import SecretsView from '../state/SecretsView';
import { GameContext } from '../GameContexts';

let GameHelpX: React.FC<{ secretsView: SecretsView }> = ({ secretsView }) => {
  const { gameApi } = useContext(GameContext);
  const colors = useColors();
  return (
    <>
      <ScrollView style={styles.dialog}>
        <Text>
          Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece
          of classical Latin literature from 45 BC, making it over 2000 years old. Richard
          McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the
          more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the
          cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum
          comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes
          of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of
          ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum
          dolor sit amet..", comes from a line in section 1.10.32.
        </Text>
      </ScrollView>
      {gameApi.info.getGameFinish() ? null : !!!secretsView.isViewingRoleInfo() ? (
        <Button
          icon="visibility"
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
          icon="visibility-off"
          color={colors.room.passive}
          onPress={secretsView.stopViewingRoleInfo}
          style={styles.button}
        >
          close view
        </Button>
      )}
    </>
  );
};
GameHelpX = observerWithMeta(loggedReactFC()(GameHelpX));

const styles = StyleSheet.create({
  dialog: {
    flex: 1,
  },
  button: {},
});

export default GameHelpX;
