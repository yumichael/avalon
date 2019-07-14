import React, { useMemo } from 'react';
import { observerWithMeta } from 'src/library/helpers/mobxHelp';
import Game from 'src/model/Game/Game';
import { PlayerContext } from '../GameContexts';
import TeamDecoratorX from './TeamDecorator';
import VoteDecoratorX from './VoteDecorator';
import LeaderDecoratorX from './LeaderDecorator';
import { loggedReactFC } from 'src/library/logging/loggers';

let PlayerAttributesX: React.FC<{ playerIndex: Game.Player.Index }> = ({ playerIndex }) => {
  const k = playerIndex;
  const playerContextValue = useMemo(() => ({ playerIndex: k }), [k]);
  return (
    <PlayerContext.Provider value={playerContextValue}>
      <TeamDecoratorX />
      <VoteDecoratorX />
      <LeaderDecoratorX />
    </PlayerContext.Provider>
  );
};
PlayerAttributesX = observerWithMeta(loggedReactFC()(PlayerAttributesX));

export default PlayerAttributesX;
