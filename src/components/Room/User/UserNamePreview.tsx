import React from 'react';
import { observerWithMeta } from 'src/library/helpers/mobxHelp';
import User from 'src/model/User/User';
import { loggedReactFC } from 'src/library/logging/loggers';
import { Text } from 'src/library/ui/components';

let UserNamePreviewX: React.FC<{ userRef: User.Ref }> = ({ userRef }) => {
  return <Text>{userRef.id}</Text>;
};
UserNamePreviewX = observerWithMeta(loggedReactFC()(UserNamePreviewX));

export default UserNamePreviewX;
