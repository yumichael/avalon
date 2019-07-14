import Room from './Room';
import Database from 'src/library/Database';
import User from '../User/User';
import DocApi from 'src/library/patterns/DocApi';
import Game from '../Game/Game';
import GameApi from '../Game/GameApi';
import { loggedConstructor, loggedMethod } from 'src/library/logging/loggers';
import { invariant } from 'src/library/exceptions/exceptions';

@loggedConstructor()
class RoomPlaying {
  readonly ref: Room.Ref;
  readonly userRef: User.Ref;
  readonly gameRef: Game.Ref;
  private get doc(): Database.Document<Room.Data> {
    return Room.dataApi.getCurrentlyOpenedDoc(this.ref)!;
  }
  private get data(): Room.Playing {
    return this.doc.data.playing!;
  }
  private getDataKey(): string {
    return 'playing';
  }

  constructor(
    contract: DocApi.WillWaitUntilDocHasDataContract,
    roomRef: Room.Ref,
    userRef: User.Ref,
  ) {
    // console.groupCollapsed(
    //   `new RoomPlaying(this: ${this}, contract: ${contract}, roomRef: ${roomRef}, userRef: ${userRef})`,
    // );
    this.ref = roomRef;
    this.userRef = userRef;
    this.gameRef = this.data.gameRef;
    // console.groupEnd();
  }

  private getGameApiSpecs(): GameApi.Specs {
    const { gameRef, userToPlayerMap, host } = this.data;
    invariant(
      gameRef.isEqual(this.gameRef),
      'Two distinct Game refs in `RoomPlaying.getGameApiSpecs()',
    );
    return {
      gameRef,
      playerIndex: userToPlayerMap[this.userRef.id],
      shouldHost: this.userRef.isEqual(host),
    };
  }

  @loggedMethod()
  initiateGameApi(): GameApi.Initiator {
    const gameApiInit = GameApi.initiate(this.getGameApiSpecs());
    if (this.getHost().isEqual(this.userRef)) {
      this.callbackToGetGameFinish = () => {
        const gameApi = gameApiInit.readyInstance;
        return gameApi && gameApi.info.getGameFinish();
      };
    }
    return gameApiInit;
  }

  getHost(): User.Ref {
    return this.data.host;
  }

  // TODO refactor so Game notifies `RoomPlaying` when finished via callback instead of current way.
  private callbackToGetGameFinish?: () => Game.Finish | undefined;
  getFinish(): Room.Playing.Finish | undefined {
    if (!!!this.data.finish && this.callbackToGetGameFinish) {
      const gameFinish = this.callbackToGetGameFinish();
      if (gameFinish) {
        const lastPlayerUserRef = this.getUserWithPlayerIndex(gameFinish.lastLeader);
        const finish: Room.Playing['finish'] = {
          lastPlayerUserRef,
          winningFaction: gameFinish.winningFaction,
        };
        this.doc.update({ [`${this.getDataKey()}.finish`]: finish });
        this.callbackToGetGameFinish = undefined;
      }
    }
    return this.data.finish;
  }

  getPlayerIndexForUser(userRef: User.Ref): Game.Player.Index | undefined {
    return this.data.userToPlayerMap[userRef.id];
  }

  getUserWithPlayerIndex(playerIndex: Game.Player.Index): User.Ref | undefined {
    for (const [userId, playerIndexForUser] of Object.entries(this.data.userToPlayerMap) as Array<
      [User.Id, Game.Player.Index]
    >) {
      if (playerIndexForUser === playerIndex) {
        return User.ref(userId);
      }
    }
    return undefined;
  }
}
namespace RoomPlaying {
  export type Feedback = 'attempted' | Feedback.Cannot;
  export namespace Feedback {
    export type Cannot = 'cannot';
  }
}

export default RoomPlaying;
