import React, { useContext } from 'react';
import { observerWithMeta } from 'src/library/helpers/mobxHelp';
import User from 'src/model/User/User';
import { loggedReactFC } from 'src/library/logging/loggers';
import { Text, StyleSheet } from 'src/library/ui/components';
import { RoomContext } from 'src/components/Room/RoomContexts';

let UserNamePreviewX: React.FC<{ userRef: User.Ref }> = ({ userRef }) => {
  const { roomApiInit } = useContext(RoomContext);
  const roomApi = roomApiInit.readyInstance;
  return <Text style={styles.text}>{roomApi?.getUserName(userRef)}</Text>;
};
UserNamePreviewX = observerWithMeta(loggedReactFC()(UserNamePreviewX));

const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});

export default UserNamePreviewX;
