import GameApi from 'src/model/Game/GameApi';
import Game from 'src/model/Game/Game';
import { ReactElement } from 'react';
import GameTrackerX from './Tracker/GameTracker';
import React from 'react';
import RoundView from './state/RoundView';
import { GameContext, RoundContext, GameContextValue, RoundContextValue } from './GameContexts';
import GameDialogX from './Dialog/GameDialog';
import GameCommandX from './Command/GameCommand';
import PlayerAttributesX from './Players/PlayerAttributes';
import GameHelpButtonX from './Help/GameHelpButton';
import HostWorkerX from './HostWorker';
import { loggedConstructor } from 'src/library/logging/loggers';
import NeedToInform from './state/NeedToInform';

@loggedConstructor()
class GameXInjection {
  readonly gameRef: Game.Ref;
  private readonly gameContextValue: GameContextValue;
  private readonly roundContextValue: RoundContextValue;

  getPlayerAttributes(playerIndex: Game.Player.Index) {
    return this.wrapGameAndRoundContext(
      <PlayerAttributesX playerIndex={playerIndex} key={playerIndex} />,
    );
  }
  getGameTracker() {
    return this.wrapGameContext(<GameTrackerX roundView={this.roundView} />);
  }
  getGameDialog() {
    return this.wrapGameAndRoundContext(<GameDialogX />);
  }
  getGameCommand() {
    return this.wrapGameAndRoundContext(<GameCommandX />);
  }
  getGameHelpButton(props: { callback: () => void; isActivated: boolean }) {
    return this.wrapGameContext(<GameHelpButtonX {...props} needToInform={this.needToInform} />);
  }
  getHostWorker() {
    return this.wrapGameContext(<HostWorkerX />);
  }

  private wrapGameContext(x: ReactElement): ReactElement {
    return <GameContext.Provider value={this.gameContextValue}>{x}</GameContext.Provider>;
  }
  private wrapGameAndRoundContext(x: ReactElement): ReactElement {
    return (
      <GameContext.Provider value={this.gameContextValue}>
        <RoundContext.Provider value={this.roundContextValue}>{x}</RoundContext.Provider>
      </GameContext.Provider>
    );
  }

  private readonly gameApi: GameApi;
  private readonly roundView: RoundView = new RoundView();
  private readonly needToInform: NeedToInform = new NeedToInform();

  constructor(gameApi: GameApi) {
    const self = this;
    this.gameApi = gameApi;
    this.gameRef = gameApi.ref;
    this.gameContextValue = { gameApi };
    this.roundContextValue = {
      get missionAndRoundIndices() {
        return self.roundView.getProperIndices(self.gameApi.info);
      },
    };
  }
}

export default GameXInjection;
