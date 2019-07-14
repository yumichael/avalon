import React from 'react';
import { observerWithMeta } from 'src/library/helpers/mobxHelp';
import User from 'src/model/User/User';
import { loggedReactFC } from 'src/library/logging/loggers';
import { StyleSheet, View } from 'src/library/ui/components';
import UserAvatarX from './UserAvatar';

let UserInRoomX: React.FC<{ userRef?: User.Ref }> = ({ userRef }) => {
  return (
    <View style={styles.default}>
      <UserAvatarX userRef={userRef} />
    </View>
  );
};
UserInRoomX = observerWithMeta(loggedReactFC()(UserInRoomX));

const styles = StyleSheet.create({
  default: {},
});

export default UserInRoomX;
