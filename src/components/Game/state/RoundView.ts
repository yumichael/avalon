import { observable, action } from 'mobx';
import GameInformer from 'src/model/Game/GameInformer';
import Game from 'src/model/Game/Game';
import { loggedConstructor, loggedMethod, loggingDisabled } from 'src/library/logging/loggers';

@loggedConstructor()
class RoundView {
  @observable missionIndex: RoundView.MissionIndex = 'latest';
  @observable roundIndex: RoundView.RoundIndex = 'latest';
  @action setMission(missionIndex: RoundView.MissionIndex) {
    this.missionIndex = missionIndex;
    this.roundIndex = 'latest';
  }
  @action setRound(roundIndex: RoundView.RoundIndex) {
    this.roundIndex = roundIndex;
  }
  @loggedMethod({ ...loggingDisabled }) getProperIndices(
    info: GameInformer,
  ): [Game.Mission.Index, Game.Mission.Round.Index] {
    // TODO check if the sticky view logic is what you want?
    const ii =
      this.missionIndex !== 'latest' && this.missionIndex > info.getLatestMissionIndex()
        ? 'latest'
        : this.missionIndex;
    const jj = this.roundIndex;
    const i = ii === 'latest' ? info.getLatestMissionIndex() : ii;
    const j = jj === 'latest' ? info.getLatestMissionRoundIndex(i)! : jj;
    return [i, j];
  }
}
namespace RoundView {
  export type MissionIndex = Game.Mission.Index | 'latest';
  export type RoundIndex = Game.Mission.Round.Index | 'latest';
}

export default RoundView;
