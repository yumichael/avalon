import Game from '../model/Game/Game';
import { createContext } from 'react';

export type GameSkin = {
  displayName: string;
  roleNames: { [role in Game.Player.Role]: string } & { good: string; evil: string };
  factionNames: { good: string; evil: string };
};

import TheResistance from './gameSkins/TheResistance.json';
import Avalon from './gameSkins/Avalon.json';
import My from './gameSkins/My.json';
const gameSkinsTypingHelper = <T>(x: { [name in keyof T]: GameSkin }) => x;
export const gameSkins = gameSkinsTypingHelper({ TheResistance, Avalon, My });

export type GameSkinContextValue = {
  readonly gameSkin: GameSkin;
};
export const GameSkinContext = createContext<GameSkinContextValue>({
  gameSkin: gameSkins.My,
});
