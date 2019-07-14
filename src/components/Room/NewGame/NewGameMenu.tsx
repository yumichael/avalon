import React, { useContext, useCallback, useState } from 'react';
import { observerWithMeta } from 'src/library/helpers/mobxHelp';
import { loggedReactFC } from 'src/library/logging/loggers';
import { ScrollView, StyleSheet, Button, View, Chip, Text } from 'src/library/ui/components';
import { RoomContext } from '../RoomContexts';
import { useColors, useRoleNames, useFancyText } from 'src/components/bits';
import Game from 'src/model/Game/Game';
import sum from 'lodash/sum';

type WhatRoles = { [role in Game.Player.Role]?: true };
function createRoleStack(whatRoles: WhatRoles): Game.Rules.RoleStack {
  return {
    ...(whatRoles.commander ? { commander: true } : null),
    ...(whatRoles.commander && whatRoles.bodyguard ? { bodyguard: true } : null),
    ...(whatRoles.commander && whatRoles.bodyguard && whatRoles.falseCommander
      ? { falseCommander: true }
      : null),
    ...(whatRoles.commander && whatRoles.deepCover ? { deepCover: true } : null),
    ...(whatRoles.blindSpy ? { blindSpy: true } : null),
  };
}

let NewGameMenuX: React.FC = () => {
  const { roomApiInit } = useContext(RoomContext);
  const roomApi = roomApiInit.readyInstance;
  const [whatRoles, setWhatRoles] = useState<WhatRoles>({});
  const startNewGame = useCallback(
    () => roomApi && roomApi.startNewGame({ roleStack: createRoleStack(whatRoles) }),
    [roomApi, whatRoles],
  );

  const colors = useColors();
  const fancyText = useFancyText();
  const toggleCommander = useCallback(
    () =>
      setWhatRoles(currWhatRoles =>
        currWhatRoles.commander
          ? {
              ...currWhatRoles,
              commander: undefined,
              bodyguard: undefined,
              falseCommander: undefined,
              deepCover: undefined,
            }
          : { ...currWhatRoles, commander: true },
      ),
    [setWhatRoles],
  );
  const toggleBodyguard = useCallback(
    () =>
      setWhatRoles(currWhatRoles =>
        currWhatRoles.bodyguard
          ? { ...currWhatRoles, bodyguard: undefined, falseCommander: undefined }
          : {
              ...currWhatRoles,
              commander: true,
              bodyguard: true,
              falseCommander: true,
            },
      ),
    [setWhatRoles],
  );
  const toggleFalseCommander = useCallback(
    () =>
      setWhatRoles(currWhatRoles =>
        currWhatRoles.falseCommander
          ? { ...currWhatRoles, falseCommander: undefined }
          : {
              ...currWhatRoles,
              commander: true,
              bodyguard: true,
              falseCommander: true,
            },
      ),
    [setWhatRoles],
  );
  const toggleDeepCover = useCallback(
    () =>
      setWhatRoles(currWhatRoles =>
        currWhatRoles.deepCover
          ? { ...currWhatRoles, deepCover: undefined }
          : {
              ...currWhatRoles,
              commander: true,
              deepCover: true,
            },
      ),
    [setWhatRoles],
  );
  const toggleBlindSpy = useCallback(
    () =>
      setWhatRoles(currWhatRoles =>
        currWhatRoles.blindSpy
          ? { ...currWhatRoles, blindSpy: undefined }
          : { ...currWhatRoles, blindSpy: true },
      ),
    [setWhatRoles],
  );

  const roleNames = useRoleNames();
  return roomApi ? (
    <>
      <ScrollView style={styles.dialog}>
        {roomApi.getSeatedCount() < Game.Player.Count.min ? (
          <Text>There must be at least {Game.Player.Count.min} users seated to play.</Text>
        ) : (
          <Text>
            There can be at most{' '}
            {
              Game.evilCountData[
                Math.min(roomApi.getSeatedCount(), Game.Player.Count.max) as Game.Player.Count
              ]
            }{' '}
            {fancyText.evil} faction special roles.
          </Text>
        )}
        <View style={styles.entries}>
          <Chip
            onPress={toggleCommander}
            selected={whatRoles.commander}
            selectedColor={whatRoles.commander ? colors.good.default : colors.concern.passive}
            style={styles.entry}
          >
            {roleNames.commander}
          </Chip>
          <Chip
            onPress={toggleBodyguard}
            selected={whatRoles.bodyguard}
            selectedColor={whatRoles.bodyguard ? colors.good.default : colors.concern.passive}
            style={styles.entry}
          >
            {roleNames.bodyguard}
          </Chip>
          <Chip
            onPress={toggleFalseCommander}
            selected={whatRoles.falseCommander}
            selectedColor={whatRoles.falseCommander ? colors.evil.default : colors.concern.passive}
            style={styles.entry}
          >
            {roleNames.falseCommander}
          </Chip>
          <Chip
            onPress={toggleDeepCover}
            selected={whatRoles.deepCover}
            selectedColor={whatRoles.deepCover ? colors.evil.default : colors.concern.passive}
            style={styles.entry}
          >
            {roleNames.deepCover}
          </Chip>
          <Chip
            onPress={toggleBlindSpy}
            selected={whatRoles.blindSpy}
            selectedColor={whatRoles.blindSpy ? colors.evil.default : colors.concern.passive}
            disabled={roomApi.getSeatedCount() < 7}
            style={styles.entry}
          >
            {roleNames.blindSpy} (7+)
          </Chip>
        </View>
        <Button
          onPress={startNewGame}
          disabled={
            !!!roomApi ||
            !!!roomApi.canStartNewGame() ||
            sum(
              (Object.keys(whatRoles) as Array<keyof WhatRoles>)
                .filter(role => Game.Player.Role.factionMap[role] === 'evil')
                .map(role => whatRoles[role]),
            ) >
              Game.evilCountData[
                Math.min(roomApi.getSeatedCount(), Game.Player.Count.max) as Game.Player.Count
              ]
          }
          color={colors.room.active}
          style={styles.submit}
        >
          START NEW GAME
        </Button>
      </ScrollView>
    </>
  ) : null;
};
NewGameMenuX = observerWithMeta(loggedReactFC()(NewGameMenuX));

const styles = StyleSheet.create({
  dialog: {
    flex: 1,
  },
  entries: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' },
  entry: { margin: 1 },
  submit: {},
});

export default NewGameMenuX;
