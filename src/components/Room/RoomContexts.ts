import EmptyContextError from '../../library/exceptions/EmptyContextError';
import RoomApi from 'src/model/Room/RoomApi';
import { createContext } from 'react';
import RoomPlaying from 'src/model/Room/RoomPlaying';
import GameXInjection from '../Game/GameXInjection';

// Must not use these contexts uninitialized!

export type RoomContextValue = {
  readonly roomApiInit: RoomApi.Initiator;
};
export const RoomContext = createContext<RoomContextValue>(
  EmptyContextError.throwOnUse({ roomApiInit: undefined }),
);

export type PlayingContextValue = {
  readonly playing?: RoomPlaying;
  readonly gameXInjection?: GameXInjection;
};
export const PlayingContext = createContext<PlayingContextValue>(
  EmptyContextError.throwOnUse({
    playing: undefined,
    gameXInjection: undefined,
  }),
);
