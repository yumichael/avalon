import Game from '../model/Game/Game';

export type GameSkin = {
  displayName: string;
  roleNames: { [role in Game.Player.Role]: string } & { good: string; evil: string };
  factionNames: { good: string; evil: string };
};

import TheResistance from './gameSkins/TheResistance.json';
import Avalon from './gameSkins/Avalon.json';
import My from './gameSkins/My.json';
import { observable } from 'mobx';
const gameSkinsTypingHelper = <T>(x: { [name in keyof T]: GameSkin }) => x;
export const gameSkins = gameSkinsTypingHelper({ TheResistance, Avalon, My });

class SkinStore {
  @observable private gameSkin: GameSkin = gameSkins.My;
  getGameSkin() {
    return this.gameSkin;
  }
}
export const skinStore = new SkinStore();
