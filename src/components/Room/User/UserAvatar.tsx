import React from 'react';
import { observerWithMeta } from 'src/library/helpers/mobxHelp';
import User from 'src/model/User/User';
import { loggedReactFC } from 'src/library/logging/loggers';
import { Avatar } from 'src/library/ui/components';
import { StyleProp, TextStyle } from 'react-native';

let UserAvatarX: React.FC<{ userRef?: User.Ref; size?: number; style?: StyleProp<TextStyle> }> = ({
  userRef,
  size,
  style,
}) => {
  return <Avatar.Text label={userRef ? userRef.id.slice(0, 3) : '---'} size={size} style={style} />;
};
UserAvatarX = observerWithMeta(loggedReactFC()(UserAvatarX));

export default UserAvatarX;
