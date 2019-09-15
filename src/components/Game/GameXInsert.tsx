import GameApi from 'src/model/Game/GameApi';
import Game from 'src/model/Game/Game';
import { ReactElement } from 'react';
import GameTrackerX from './Tracker/GameTracker';
import React from 'react';
import RoundView from './state/RoundView';
import { GameContext, RoundContext, GameContextValue, RoundContextValue } from './GameContexts';
import GameCommandX from './Command/GameCommand';
import PlayerAttributesX from './Players/PlayerAttributes';
import GameHelpButtonX from './Accessory/GameHelpButton';
import HostWorkerX from './HostWorker';
import { loggedConstructor } from 'src/library/logging/loggers';
import SecretsView from './state/SecretsView';
import GameHelpX from './Help/GameHelp';
import ViewSecretsButtonX from './Accessory/ViewSecretsButton';

@loggedConstructor()
class GameXInsert {
  readonly gameRef: Game.Ref;
  private readonly gameContextValue: GameContextValue;
  private readonly roundContextValue: RoundContextValue;

  getPlayerAttributes(playerIndex: Game.Player.Index) {
    return this.wrapGameAndRoundContext(
      <PlayerAttributesX
        playerIndex={playerIndex}
        key={playerIndex}
        secretsView={this.secretsView}
      />,
    );
  }
  getGameTracker() {
    return this.wrapGameContext(<GameTrackerX roundView={this.roundView} />);
  }
  getGameCommand() {
    return this.wrapGameAndRoundContext(<GameCommandX roundView={this.roundView} />);
  }
  getGameHelpButton(props: { callback: () => void; beenActivated: boolean }) {
    return this.wrapGameContext(<GameHelpButtonX {...props} />, 'GameHelp');
  }
  getViewSecretsButton() {
    return this.wrapGameContext(
      <ViewSecretsButtonX secretsView={this.secretsView} />,
      'ViewSecrets',
    );
  }
  getGameHelp() {
    return this.wrapGameAndRoundContext(<GameHelpX secretsView={this.secretsView} />);
  }
  getHostWorker() {
    return this.wrapGameContext(<HostWorkerX />);
  }

  private wrapGameContext(x: ReactElement, key?: string): ReactElement {
    return (
      <GameContext.Provider key={key} value={this.gameContextValue}>
        {x}
      </GameContext.Provider>
    );
  }
  private wrapGameAndRoundContext(x: ReactElement, key?: string): ReactElement {
    return (
      <GameContext.Provider key={key} value={this.gameContextValue}>
        <RoundContext.Provider value={this.roundContextValue}>{x}</RoundContext.Provider>
      </GameContext.Provider>
    );
  }

  readonly gameApi: GameApi;
  private readonly roundView: RoundView;
  private readonly secretsView: SecretsView;

  constructor(gameApi: GameApi) {
    const self = this;
    this.gameApi = gameApi;
    this.roundView = new RoundView(gameApi);
    this.roundView.setCurrent();
    this.secretsView = new SecretsView(gameApi);
    this.gameRef = gameApi.ref;
    this.gameContextValue = { gameApi };
    this.roundContextValue = {
      get missionAndRoundIndices() {
        return self.roundView.getIndices();
      },
    };
  }
}

export default GameXInsert;
