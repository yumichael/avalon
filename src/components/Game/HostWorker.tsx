import React, { useContext, useEffect } from 'react';
import { observerWithMeta } from 'src/library/helpers/mobxHelp';
import { GameContext } from './GameContexts';
import { autorun } from 'mobx';
import { loggedReactFC } from 'src/library/logging/loggers';

let HostWorkerX: React.FC = () => {
  const { gameApi } = useContext(GameContext);
  gameApi.getAutorunCallbacks().forEach(callback => useEffect(() => autorun(callback), [gameApi]));
  return null;
};
HostWorkerX = observerWithMeta(loggedReactFC()(HostWorkerX));

export default HostWorkerX;
