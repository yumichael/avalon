import { observable, action } from 'mobx';
import GameInformer from 'src/model/Game/GameInformer';
import Game from 'src/model/Game/Game';
import { loggedConstructor, loggedMethod, loggingDisabled } from 'src/library/logging/loggers';
import autobind from 'autobind-decorator';
import GameApi from 'src/model/Game/GameApi';

@loggedConstructor()
@autobind
class RoundView {
  private readonly info: GameInformer;
  constructor(gameApi: GameApi) {
    this.info = gameApi.info;
  }

  @observable private missionIndex: Game.Mission.Index = 0;
  @observable private roundIndex: Game.Mission.Round.Index = 0;
  @action setMission(missionIndex: RoundView.MissionIndex) {
    const ii = this.info.getLatestMissionIndex();
    if (missionIndex === 'latest' || missionIndex > ii) {
      missionIndex = ii;
    }
    this.missionIndex = missionIndex;
    this.roundIndex = this.info.getLatestMissionRoundIndex(missionIndex)!;
  }
  @action setRound(roundIndex: RoundView.RoundIndex) {
    let jj = this.info.getLatestMissionRoundIndex(this.missionIndex);
    jj = jj === undefined ? 0 : jj;
    if (roundIndex === 'latest' || roundIndex > jj) {
      roundIndex = jj!;
    }
    this.roundIndex = roundIndex;
  }
  @action setCurrent() {
    this.setMission('latest');
  }
  @loggedMethod({ ...loggingDisabled }) getIndices(): [
    Game.Mission.Index,
    Game.Mission.Round.Index,
  ] {
    return [this.missionIndex, this.roundIndex];
  }
}
namespace RoundView {
  export type MissionIndex = Game.Mission.Index | 'latest';
  export type RoundIndex = Game.Mission.Round.Index | 'latest';
}

export default RoundView;
