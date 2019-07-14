import Game from 'src/model/Game/Game';
import GameApi from 'src/model/Game/GameApi';
import { createContext } from 'react';
import EmptyContextError from 'src/library/exceptions/EmptyContextError';

// Must not use these contexts uninitialized!

export type GameContextValue = {
  readonly gameApi: GameApi;
};
export const GameContext = createContext<GameContextValue>(
  EmptyContextError.throwOnUse({ gameApi: undefined }),
);

export type RoundContextValue = {
  readonly missionAndRoundIndices: [Game.Mission.Index, Game.Mission.Round.Index];
};
export const RoundContext = createContext<RoundContextValue>(
  EmptyContextError.throwOnUse({ missionAndRoundIndices: undefined }),
);

export type PlayerContextValue = {
  readonly playerIndex: Game.Player.Index;
};
export const PlayerContext = createContext<PlayerContextValue>(
  EmptyContextError.throwOnUse({ playerIndex: undefined }),
);
