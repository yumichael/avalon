import React from 'react';
import { observerWithMeta } from 'src/library/helpers/mobxHelp';
import User from 'src/model/User/User';
import { loggedReactFC } from 'src/library/logging/loggers';
import { StyleSheet, View } from 'src/library/ui/components';
import UserAvatarX from './UserAvatar';
import UserNamePreviewX from './UserNamePreview';

export type UserView = 'avatar' | 'name';

let UserInRoomX: React.FC<{ userRef: User.Ref; userView: UserView }> = ({ userRef, userView }) => {
  return userRef ? (
    <View style={styles.default}>
      {userView === 'name' ? (
        <UserNamePreviewX userRef={userRef} />
      ) : (
        // TODO sorry the touch to see name part is in `SeatX` for ease of coding.
        // <TouchableRipple onPress={viewName} style={styles.touch}>
        <UserAvatarX userRef={userRef} />
        // </TouchableRipple>
      )}
    </View>
  ) : null;
};
UserInRoomX = observerWithMeta(loggedReactFC()(UserInRoomX));

const styles = StyleSheet.create({
  default: {},
});

export default UserInRoomX;
