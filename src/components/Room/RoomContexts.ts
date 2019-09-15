import EmptyContextError from '../../library/exceptions/EmptyContextError';
import RoomApi from 'src/model/Room/RoomApi';
import { createContext } from 'react';
import RoomPlaying from 'src/model/Room/RoomPlaying';
import GameXInsert from '../Game/GameXInsert';
import RoomXState from './RoomXState';

// Must not use these contexts uninitialized!

export type RoomContextValue = {
  readonly roomApiInit: RoomApi.Initiator;
  readonly state: RoomXState;
};
export const RoomContext = createContext<RoomContextValue>(
  EmptyContextError.throwOnUse({ roomApiInit: undefined, state: undefined }),
);

export type PlayingContextValue = {
  readonly playing?: RoomPlaying;
  readonly gameXInsert?: GameXInsert;
};
export const PlayingContext = createContext<PlayingContextValue>(
  EmptyContextError.throwOnUse({
    playing: undefined,
    gameXInsert: undefined,
  }),
);
