import React from 'react';
import { observerWithMeta } from 'src/library/helpers/mobxHelp';
import User, { getUserAvatarUri } from 'src/model/User/User';
import { loggedReactFC } from 'src/library/logging/loggers';
import { Avatar } from 'src/library/ui/components';
import { StyleProp, TextStyle, PixelRatio } from 'react-native';

let UserAvatarX: React.FC<{ userRef: User.Ref; size?: number; style?: StyleProp<TextStyle> }> = ({
  userRef,
  size,
  style,
}) => {
  const avatarUri = getUserAvatarUri(userRef, size! * PixelRatio.get());
  const picture = avatarUri ? { uri: avatarUri } : null;
  return picture ? <Avatar.Image source={picture} size={size} style={style} /> : null;
};
UserAvatarX = observerWithMeta(loggedReactFC()(UserAvatarX));

export default UserAvatarX;
