import Game from './Game';
import GameInformer from './GameInformer';
import shuffle from 'lodash/shuffle';
import DocApi from 'src/library/patterns/DocApi';
import { loggedConstructor, loggedMethod } from 'src/library/logging/loggers';
import size from 'lodash/size';

@loggedConstructor()
class GameHost {
  private readonly ref: Game.Ref;
  private readonly info: GameInformer;
  private get doc(): Game.Doc {
    return Game.dataApi.getCurrentlyOpenedDoc(this.ref)!;
  }

  constructor(
    contract: DocApi.WillWaitUntilDocHasDataContract,
    gameRef: Game.Ref,
    info: GameInformer,
  ) {
    // console.groupCollapsed(
    //   `new GameHost(this: ${this}, contract: ${contract}, gameRef: ${gameRef}, info: ${info})`,
    // );
    this.ref = gameRef;
    this.info = info;
    // console.groupEnd();
  }

  @loggedMethod()
  static setupNewGame(specs: Game.Specs, gameDoc: Game.Doc) {
    const { playerCount, startingPlayerIndex, rules } = specs;
    const players = this.createPlayers(playerCount, rules.roleStack);
    const playersAttributes = this.createPlayersAttributes(playerCount);
    const init: Game.Data = {
      players,
      play: {
        missions: {
          0: {
            rounds: {
              0: {
                playersAttributes,
                leader: startingPlayerIndex,
                teamStatus: 'tentative',
              },
            },
          },
        },
      },
      rules,
    };
    gameDoc.set(init);
  }

  private readonly autorunCallbacks: GameHost.AutorunCallbacks = [
    () => this.endGameWhenNeeded(),
    () => this.addNextMissionRoundDataWhenNeeded(),
  ];
  @loggedMethod()
  getAutorunCallbacks(): GameHost.AutorunCallbacks {
    return this.autorunCallbacks;
  }

  private endGameWhenNeeded() {
    const { info } = this;
    const winningFaction = info.getWinningFaction();
    if (winningFaction) {
      const [i, j] = info.getLatestMissionAndRoundIndices();
      const leader = info.getMissionRoundLeader(i, j)!;
      const finish: Game.Data['finish'] = { lastLeader: leader, winningFaction };
      this.doc.update({ finish });
    }
  }

  private addNextMissionRoundDataWhenNeeded() {
    const { info } = this;
    const [i, j] = info.getLatestMissionAndRoundIndices();
    const nextLeader: () => Game.Player.Index = () => {
      const previous = info.getMissionRoundLeader(i, j)!;
      return ((previous + 1) % info.getPlayerCount()) as Game.Player.Index;
    };
    const vote = info.getMissionRoundVoteOutcome(i, j);
    if (vote === 'reject' && j + 1 < info.getRoundCountForMission(i)) {
      const playersAttributes = GameHost.createPlayersAttributes(info.getPlayerCount());
      const roundKey = Game.Data.getMissionRoundKey(i, (j + 1) as Game.Mission.Round.Index);
      const roundData: Game.Data.getMissionRoundKey.valueType = {
        playersAttributes,
        leader: nextLeader(),
        teamStatus: 'tentative',
      };
      this.doc.update({ [roundKey]: roundData });
    } else if (
      vote === 'approve' &&
      info.getMissionResult(i) &&
      i + 1 < info.getMissionCount() &&
      !!!info.getMissionsResult()
    ) {
      const playersAttributes = GameHost.createPlayersAttributes(info.getPlayerCount());
      const missionKey = Game.Data.getMissionKey((i + 1) as Game.Mission.Index);
      const missionData: Game.Data.getMissionKey.valueType = {
        rounds: {
          0: {
            playersAttributes,
            leader: nextLeader(),
            teamStatus: 'tentative',
          },
        },
      };
      this.doc.update({ [missionKey]: missionData });
    }
  }

  private static createPlayers(
    playerCount: Game.Player.Count,
    roleStack?: Game.Rules.RoleStack,
  ): Game.Players {
    const evilCount = Game.evilCountData[playerCount];
    const playerIndices = shuffle(Game.Player.Index.range(playerCount));
    const playerInit: Game.MutablePlayer[] = playerIndices.map(k => ({ faction: 'good' }));
    playerIndices.slice(0, evilCount).forEach(k => (playerInit[k] = { faction: 'evil' }));

    if (roleStack) {
      const evilRoles = (Object.keys(roleStack) as Game.Player.Role[])
        .filter(role => Game.Player.Role.factionMap[role] === 'evil')
        .sort((a, b) => Game.Player.Role.priorityMap[a] - Game.Player.Role.priorityMap[b]);
      const goodRoles = (Object.keys(roleStack) as Game.Player.Role[])
        .filter(role => Game.Player.Role.factionMap[role] === 'good')
        .sort((a, b) => Game.Player.Role.priorityMap[a] - Game.Player.Role.priorityMap[b]);
      playerIndices
        .slice(0, Math.min(evilCount, size(evilRoles)))
        .forEach((k, i) => (playerInit[k].role = evilRoles[i]));
      playerIndices
        .slice(evilCount, evilCount + Math.min(playerCount - evilCount, size(goodRoles)))
        .forEach((k, i) => (playerInit[k].role = goodRoles[i]));
    }

    // Note the following line is mandatory for `players` to be an `Object` and not an `Array` when compiled to JS.
    const players: Game.Players = Object.assign({}, playerInit as Game.Players);
    return players;
  }

  private static createPlayersAttributes(
    playerCount: Game.Player.Count,
  ): Game.Mission.Round.PlayersAttributes {
    const playerIndices = Game.Player.Index.range(playerCount);
    const playersAttributesInit: Game.Mission.Round.PlayerAttributes[] = playerIndices.map(
      k => ({}),
    );
    // Note the following line is mandatory for `playersAttributes` to be an `Object` and not an `Array` in JS.
    const playersAttributes: Game.Mission.Round.PlayersAttributes = Object.assign(
      {},
      playersAttributesInit as Game.Mission.Round.PlayersAttributes,
    );
    return playersAttributes;
  }
}
namespace GameHost {
  export type AutorunCallback = () => void;
  export type AutorunCallbacks = [AutorunCallback, AutorunCallback];
}

export default GameHost;
