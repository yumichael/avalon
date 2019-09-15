import DocApi from 'src/library/patterns/DocApi';
import Game from './Game';
import GameHost from './GameHost';
import GameInformer from './GameInformer';
import GameActor from './GameActor';
import { loggedConstructor, loggedMethod, logged, loggingBody } from 'src/library/logging/loggers';

@loggedConstructor({ ...loggingBody }) // TODO try removing `loggedConstructor` and seeing what the native class looks like in the console (copy more metadata).
class GameApi implements DocApi<Game.Ref> {
  readonly info: GameInformer;
  readonly act?: GameActor;
  readonly host?: GameHost;

  readonly ref: Game.Ref;
  private get doc(): Game.Doc {
    return Game.dataApi.getCurrentlyOpenedDoc(this.ref)!;
  }
  private readonly contract: DocApi.WillWaitUntilDocHasDataContract;

  @loggedMethod()
  static setupNewGame(gameRef: Game.Ref, specs: Game.Specs) {
    const gameDoc = Game.dataApi.openUntrackedDoc(gameRef);
    GameHost.setupNewGame(specs, gameDoc);
  }

  @loggedMethod()
  static initiate(specs: GameApi.Specs): GameApi.Initiator {
    return new GameApi.Initiator(specs);
  }

  constructor(contract: DocApi.WillWaitUntilDocHasDataContract, specs: GameApi.Specs) {
    this.contract = contract;
    const { gameRef, playerIndex, shouldHost } = specs;
    Game.dataApi.openNewDoc(gameRef);
    this.ref = gameRef;
    this.info = new GameInformer(this.contract, gameRef);
    this.act =
      playerIndex !== undefined
        ? new GameActor(this.contract, gameRef, playerIndex, this.info)
        : undefined;
    this.host = shouldHost ? new GameHost(this.contract, gameRef, this.info) : undefined;
    logged({
      gameRef,
      'this.info': this.info,
      'this.act': this.act,
      'this.host': this.host,
    });
  }

  @loggedMethod()
  getDataState(): Game.Data.State {
    return this.doc && this.doc.hasData ? 'ready' : 'loading';
  }

  // ATTENTION! Everything method below MUST NOT be called before the data is synced from Firebase.

  private readonly nullAutorunCallbacks: GameHost.AutorunCallbacks = [() => null, () => null];
  @loggedMethod()
  getAutorunCallbacks(): GameHost.AutorunCallbacks {
    return this.host ? this.host.getAutorunCallbacks() : this.nullAutorunCallbacks;
  }
}
namespace GameApi {
  export type Feedback = 'attempted' | Feedback.Cannot;
  export namespace Feedback {
    export type Cannot = 'cannot';
  }

  export class Initiator extends DocApi.Initiator.createSubclass<Game.Ref, GameApi, GameApi.Specs>(
    GameApi,
  ) {}
  export type Specs = {
    gameRef: Game.Ref;
    playerIndex?: Game.Player.Index;
    shouldHost?: boolean;
  };
}

export default GameApi;
