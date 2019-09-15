import Game from './Game';
import sum from 'lodash/sum';
import size from 'lodash/size';
import DocApi from 'src/library/patterns/DocApi';
import { loggedConstructor } from 'src/library/logging/loggers';

@loggedConstructor()
class GameInformer {
  private readonly ref: Game.Ref;
  private get doc(): Game.Doc {
    return Game.dataApi.getCurrentlyOpenedDoc(this.ref)!;
  }

  constructor(contract: DocApi.WillWaitUntilDocHasDataContract, gameRef: Game.Ref) {
    this.ref = gameRef;
    // console.groupEnd();
  }

  // ATTENTION! Every method below MUST ONLY be called when `this.getGameDataState() === 'ready'`.

  getPlayerRoleView(
    playerIndex: Game.Player.Index,
    viewingPlayerIndex?: Game.Player.Index,
  ): Game.Player.RoleView | null {
    const faction = this.getPlayerFaction(playerIndex);
    const roleOrFaction = this.getPlayerRole(playerIndex) || faction;
    if (this.getGameFinish() || playerIndex === viewingPlayerIndex) {
      return roleOrFaction;
    } else if (viewingPlayerIndex !== undefined) {
      switch (this.getPlayerRole(viewingPlayerIndex) || this.getPlayerFaction(viewingPlayerIndex)) {
        case 'commander':
          switch (roleOrFaction) {
            case 'deepCover':
              return null;
            case 'evil':
              return 'evil';
            default:
              return null;
          }
        case 'bodyguard':
          switch (roleOrFaction) {
            case 'commander':
            case 'falseCommander':
              return 'bodyguardView';
            default:
              return null;
          }
        case 'evil':
        case 'deepCover':
        case 'falseCommander':
          switch (roleOrFaction) {
            case 'evil':
            case 'deepCover':
            case 'falseCommander':
              return 'evil';
            default:
              return null;
          }
        case 'blindSpy':
        case 'good':
          return null;
      }
    } else {
      return null;
    }
    // Should already have returned a value in all cases covered but I guess Typescript is weak.
    return null;
  }

  getPlayerFaction(playerIndex: Game.Player.Index): Game.Player.Faction {
    const player = this.players[playerIndex]!;
    return player.faction;
  }

  getPlayerRole(playerIndex: Game.Player.Index): Game.Player.Role | undefined {
    const player = this.players[playerIndex]!;
    return player.role;
  }

  getLatestMissionIndex(): Game.Mission.Index {
    return (this.getMissionsDataSize() - 1) as Game.Mission.Index;
  }

  getLatestMissionRoundIndex(
    missionIndex: Game.Mission.Index,
    // If `missionIndex <= this.getLatestMissionIndex()`, return is guaranteed to not be `undefined`.
  ): Game.Mission.Round.Index | undefined {
    const j = this.getRoundsDataSizeForMission(missionIndex);
    if (j === undefined) {
      return undefined;
    } else {
      return (j - 1) as Game.Mission.Round.Index;
    }
  }

  getLatestMissionAndRoundIndices(): [Game.Mission.Index, Game.Mission.Round.Index] {
    const i = this.getLatestMissionIndex();
    const j = this.getLatestMissionRoundIndex(i)!;
    return [i, j];
  }

  // isMissionInPlay(missionIndex: Game.Mission.Index): boolean {
  //   return this.getLatestMissionIndex() >= missionIndex;
  // }

  // isMissionRoundInPlay(
  //   missionIndex: Game.Mission.Index,
  //   roundIndex: Game.Mission.Round.Index,
  // ): boolean {
  //   const j = this.getLatestMissionRoundIndex(missionIndex);
  //   return j !== undefined && j >= roundIndex;
  // }

  getMissionRoundStatus(
    missionIndex: Game.Mission.Index,
    roundIndex: Game.Mission.Round.Index,
  ): Game.Mission.Round.Status {
    const [i, j] = [missionIndex, roundIndex];
    const [latestI, latestJ] = [this.getLatestMissionIndex(), this.getLatestMissionRoundIndex(i)];
    if (latestJ !== undefined) {
      if (latestJ > j || latestI > i || this.getMissionsResult()) {
        return 'finished';
      } else {
        return 'current';
      }
    } else {
      if (latestI > i || this.getMissionsResult()) {
        return 'notNeeded';
      } else {
        return 'future';
      }
    }
  }

  getMissionRoundVoteOutcome(
    missionIndex: Game.Mission.Index,
    roundIndex: Game.Mission.Round.Index,
  ): Game.Mission.Round.Vote | undefined {
    const round = this.getMissionRoundData(missionIndex, roundIndex);
    if (
      !!!round ||
      !!!this.getMissionRoundProgress(missionIndex, roundIndex).includes('finishedVoting')
    ) {
      return undefined;
    } else {
      if (
        roundIndex === this.getRoundCountForMission(missionIndex) - 1 ||
        this.getMissionRoundApproveCount(missionIndex, roundIndex)! > this.getPlayerCount() / 2
      ) {
        return 'approve';
      } else {
        return 'reject';
      }
    }
  }

  getMissionStatus(missionIndex: Game.Mission.Index): Game.Mission.Status {
    const i = missionIndex;
    const latestI = this.getLatestMissionIndex();
    if (latestI >= i) {
      if (latestI > i || this.getMissionsResult()) {
        return 'finished';
      } else {
        return 'current';
      }
    } else {
      if (this.getMissionsResult()) {
        return 'notNeeded';
      } else {
        return 'future';
      }
    }
  }

  getMissionResult(missionIndex: Game.Mission.Index): Game.Mission.Result | undefined {
    const [i, j] = [missionIndex, this.getLatestMissionRoundIndex(missionIndex)];
    if (j === undefined) {
      return undefined;
    }
    return this.getMissionResultFromRound(i, j);
  }

  getMissionResultFromRound(
    missionIndex: Game.Mission.Index,
    roundIndex: Game.Mission.Round.Index,
  ): Game.Mission.Result | undefined {
    const round = this.getMissionRoundData(missionIndex, roundIndex);
    if (!!!round) {
      return undefined;
    }
    const bidCount = this.getMissionRoundBidCount(missionIndex, roundIndex)!;
    if (this.getTeamSizeForMission(missionIndex) !== bidCount) {
      return undefined;
    } else {
      const successBidCount = this.getMissionRoundSuccessCount(missionIndex, roundIndex)!;
      const failBidCount = this.getMissionRoundFailCount(missionIndex, roundIndex)!;
      if (failBidCount < this.getFailingBidCountForMission(missionIndex)) {
        return { successBidCount, failBidCount, outcome: 'success' };
      } else {
        return { successBidCount, failBidCount, outcome: 'fail' };
      }
    }
  }

  getFailingBidCountForMission(missionIndex: Game.Mission.Index): number {
    return this.getPlayerCount() >= 7 && missionIndex === 3 ? 2 : 1;
  }

  getMissionsResult(): Game.Missions.Result | undefined {
    const missionCount = this.getMissionCount();
    const results = Game.Mission.Index.range(missionCount).map(i => this.getMissionResult(i));
    const successCount = sum(results.map(r => !!r && r.outcome === 'success'));
    const failCount = sum(results.map(r => !!r && r.outcome === 'fail'));
    if (successCount <= missionCount / 2 && failCount <= missionCount / 2) {
      return undefined;
    } else {
      if (successCount > missionCount / 2) {
        return { successCount, failCount, outcome: 'successful' };
      } else {
        return { successCount, failCount, outcome: 'failed' };
      }
    }
  }

  getWinningFaction(): Game.Player.Faction | undefined {
    const result = this.getMissionsResult();
    if (!!!result) {
      return undefined;
    }
    switch (result.outcome) {
      case 'successful':
        return 'good';
      case 'failed':
        return 'evil';
    }
  }

  getGameFinish(): Game.Finish | undefined {
    return this.doc.data.finish;
  }

  readonly getMissionRoundWorkingTeamSize: (
    missionIndex: Game.Mission.Round.Index,
    roundIndex: Game.Mission.Round.Index,
  ) => number | undefined = GameInformer.AGG_MISSION_ROUND_PLAYERS_ATTRIBUTE(p => !!p.inTeam);

  readonly getMissionRoundBidCount: (
    missionIndex: Game.Mission.Round.Index,
    roundIndex: Game.Mission.Round.Index,
  ) => number | undefined = GameInformer.AGG_MISSION_ROUND_PLAYERS_ATTRIBUTE(p => !!p.bid);

  readonly getMissionRoundSuccessCount: (
    missionIndex: Game.Mission.Round.Index,
    roundIndex: Game.Mission.Round.Index,
  ) => number | undefined = GameInformer.AGG_MISSION_ROUND_PLAYERS_ATTRIBUTE(
    p => p.bid === 'success',
  );

  readonly getMissionRoundFailCount: (
    missionIndex: Game.Mission.Round.Index,
    roundIndex: Game.Mission.Round.Index,
  ) => number | undefined = GameInformer.AGG_MISSION_ROUND_PLAYERS_ATTRIBUTE(p => p.bid === 'fail');

  readonly getMissionRoundVoteCount: (
    missionIndex: Game.Mission.Round.Index,
    roundIndex: Game.Mission.Round.Index,
  ) => number | undefined = GameInformer.AGG_MISSION_ROUND_PLAYERS_ATTRIBUTE(p => !!p.vote);

  readonly getMissionRoundApproveCount: (
    missionIndex: Game.Mission.Round.Index,
    roundIndex: Game.Mission.Round.Index,
  ) => number | undefined = GameInformer.AGG_MISSION_ROUND_PLAYERS_ATTRIBUTE(
    p => p.vote === 'approve',
  );

  readonly getMissionRoundRejectCount: (
    missionIndex: Game.Mission.Round.Index,
    roundIndex: Game.Mission.Round.Index,
  ) => number | undefined = GameInformer.AGG_MISSION_ROUND_PLAYERS_ATTRIBUTE(
    p => p.vote === 'reject',
  );

  getMissionCount(): Game.Mission.Count {
    return Game.Mission.count;
  }

  getRoundCountForMission(missionIndex: Game.Mission.Index): Game.Mission.Round.Count {
    return Game.Mission.Round.count;
  }

  getTeamSizeForMission(missionIndex: Game.Mission.Index): number {
    return Game.teamSizeData[this.getPlayerCount()][missionIndex];
  }

  getMissionRoundTeamStatus(
    missionIndex: Game.Mission.Index,
    roundIndex: Game.Mission.Round.Index,
  ): Game.Mission.Round.TeamStatus | undefined {
    const round = this.getMissionRoundData(missionIndex, roundIndex);
    return round && round.teamStatus;
  }

  getMissionRoundProgress(
    missionIndex: Game.Mission.Index,
    roundIndex: Game.Mission.Round.Index,
  ): Game.Mission.Round.Progress {
    const [i, j] = [missionIndex, roundIndex];
    const progress: Game.Mission.Round.Progress = [];
    const round = this.getMissionRoundData(i, j);
    if (!!!round) {
      return progress;
    }
    progress.push('choosingTeam');
    if (round.teamStatus !== 'decided') {
      return progress;
    }
    progress.push('decidedTeam');
    if (
      this.getMissionRoundVoteCount(i, j) !== this.getPlayerCount() &&
      j !== this.getRoundCountForMission(i) - 1
    ) {
      return progress;
    }
    progress.push('finishedVoting');
    if (this.getMissionRoundBidCount(i, j) !== this.getMissionRoundWorkingTeamSize(i, j)) {
      return progress;
    }
    progress.push('finishedMission');
    return progress;
  }

  getPlayerCount(): Game.Player.Count {
    return size(this.players) as Game.Player.Count;
  }

  getMissionRoundPlayerAttributes(
    missionIndex: Game.Mission.Index,
    roundIndex: Game.Mission.Round.Index,
    playerIndex: Game.Player.Index,
  ): Game.Mission.Round.PlayerAttributes | undefined {
    const round = this.getMissionRoundData(missionIndex, roundIndex);
    return round && round.playersAttributes[playerIndex];
  }

  getMissionRoundLeader(
    missionIndex: Game.Mission.Index,
    roundIndex: Game.Mission.Round.Index,
  ): Game.Player.Index | undefined {
    const round = this.getMissionRoundData(missionIndex, roundIndex);
    return round && round.leader;
  }

  // private getMissionData(i: Game.Mission.Index): Game.Mission {
  //   return this.play.missions[i];
  // }

  private getMissionRoundData(
    i: Game.Mission.Index,
    j: Game.Mission.Round.Index,
    // If `i <= this.getLatestMissionIndex() && j <= this.getLatestMissionRoundIndex(i)`,
    // return is guaranteed to not be `undefined`.
  ): Game.Mission.Round | undefined {
    const mission = this.play.missions[i];
    return mission && mission.rounds[j];
  }

  private getMissionsDataSize(): number {
    return size(this.play.missions);
  }

  private getRoundsDataSizeForMission(
    i: Game.Mission.Index,
    // If `i <= this.getLatestMissionIndex()` return is guaranteed to not be `undefined`.
  ): number | undefined {
    const mission = this.play.missions[i];
    return size(mission && mission.rounds);
  }
  private get players(): { [_ in Game.Player.Index]?: Game.Player } {
    return this.doc.data.players;
  }
  private get play(): Game.Play {
    return this.doc.data.play;
  }

  private static aggPlayersAttribute(
    playersAttributes: Game.Mission.Round.PlayersAttributes,
    callback: (p: Game.Mission.Round.PlayerAttributes) => boolean,
  ): number {
    const playerIndices = Game.Player.Index.range(size(playersAttributes));
    return sum(
      playerIndices.map(k => {
        const p = playersAttributes[k];
        return !!p && callback(p);
      }),
    );
  }

  // A functor used for defining a certain pattern of methods.
  private static AGG_MISSION_ROUND_PLAYERS_ATTRIBUTE(
    callback: (p: Game.Mission.Round.PlayerAttributes) => boolean,
  ): (
    this: GameInformer,
    i: Game.Mission.Round.Index,
    j: Game.Mission.Round.Index,
  ) => number | undefined {
    return function(this: GameInformer, i: Game.Mission.Round.Index, j: Game.Mission.Round.Index) {
      const round = this.getMissionRoundData(i, j);
      if (!!!round) {
        return undefined;
      }
      return GameInformer.aggPlayersAttribute(round.playersAttributes, callback);
    };
  }
}

export default GameInformer;
