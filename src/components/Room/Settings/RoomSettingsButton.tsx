import React from 'react';
import { observerWithMeta } from 'src/library/helpers/mobxHelp';
import { loggedReactFC } from 'src/library/logging/loggers';

let RoomSettingsButtonX: React.FC = () => {
  return <button>Settings</button>;
};
RoomSettingsButtonX = observerWithMeta(loggedReactFC()(RoomSettingsButtonX));

export default RoomSettingsButtonX;
