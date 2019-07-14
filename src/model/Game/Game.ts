import Database from 'src/library/Database';
import lodashRange from 'lodash/range';

namespace Game {
  const collectionId = 'games';
  export type Id = string;
  export type Ref = Database.DocumentReference;
  export type Doc = Database.Document<Game.Data>;
  export const dataApi = new Database.SingleDocumentStore<Game.Data>(collectionId);

  // This is the data that is to be synced with Firestore.
  export type Data = {
    readonly players: Players;
    readonly play: Play;
    readonly finish?: Finish;
    readonly rules: Rules;
  };
  export namespace Data {
    export type State = 'ready' | 'loading';
    // Get the Firestore query key for a `Mission`.
    export function getMissionKey(missionIndex: Mission.Index): string {
      return `play.missions.${missionIndex}`;
    }
    export namespace getMissionKey {
      export type valueType = Game.Mission;
    }
    // Get the Firestore query key for a `Mission.Round`.
    export function getMissionRoundKey(
      missionIndex: Mission.Index,
      roundIndex: Mission.Round.Index,
    ): string {
      return `play.missions.${missionIndex}.rounds.${roundIndex}`;
    }
    export namespace getMissionRoundKey {
      export type valueType = Game.Mission.Round;
    }
    // Get the Firestore query key for a `PlayerAttribute`.
    export function getMissionRoundPlayerAttributesKey(
      missionIndex: Mission.Index,
      roundIndex: Mission.Round.Index,
      playerIndex: Player.Index,
    ): string {
      return `play.missions.${missionIndex}.rounds.${roundIndex}.playersAttributes.${playerIndex}`;
    }
    export namespace getMissionRoundPlayerAttributesKey {
      export type valueType = Game.Mission.Round.PlayerAttributes;
    }
  }

  export const teamSizeData: {
    readonly [_ in Player.Count]: {
      readonly [_ in Mission.Round.Index]: number;
    };
  } = {
    5: [2, 3, 2, 3, 3],
    6: [2, 3, 4, 3, 4],
    7: [2, 3, 3, 4, 4],
    8: [3, 4, 4, 5, 5],
    9: [3, 4, 4, 5, 5],
    10: [3, 4, 4, 5, 5],
  };
  export const evilCountData: { readonly [_ in Player.Count]: number } = {
    5: 2,
    6: 2,
    7: 3,
    8: 3,
    9: 3,
    10: 4,
  };

  export type Players = { readonly [_ in Player.Index]?: Player };
  export type Player = {
    readonly faction: Player.Faction;
    readonly role?: Player.Role;
  };
  export type MutablePlayer = {
    faction: Player.Faction;
    role?: Player.Role;
  };
  export namespace Player {
    export type Count = 5 | 6 | 7 | 8 | 9 | 10;
    export namespace Count {
      export const min = 5;
      export const max = 10;
    }

    export type Index = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9; // Actually needs to be in [0, <current-player-count>).
    export namespace Index {
      export function range(playerCount: number): Player.Index[] {
        return lodashRange(playerCount) as Player.Index[];
      }
    }

    export type Faction = 'good' | 'evil';

    export type Role = 'commander' | 'bodyguard' | 'falseCommander' | 'deepCover' | 'blindSpy';
    export namespace Role {
      export const factionMap: { [role in Player.Role]: Player.Faction } = {
        commander: 'good',
        bodyguard: 'good',
        falseCommander: 'evil',
        deepCover: 'evil',
        blindSpy: 'evil',
      };
      export const priorityMap: { [role in Player.Role]: number } = {
        commander: 0,
        bodyguard: 1,
        falseCommander: 1,
        deepCover: 2,
        blindSpy: 3,
      };
    }
  }

  export type Play = {
    readonly missions: Missions;
  };

  export type Missions = { readonly [_ in Mission.Index]?: Mission };
  export namespace Missions {
    export type Outcome = 'successful' | 'failed';
    export type Result = {
      readonly successCount: number;
      readonly failCount: number;
      readonly outcome: Outcome;
    };
  }

  export type Mission = {
    readonly rounds: Mission.Rounds;
  };
  export namespace Mission {
    export type Count = 5;
    export const count: Count = 5;
    export type Index = 0 | 1 | 2 | 3 | 4;
    export namespace Index {
      export function range(missionCount: number): Mission.Index[] {
        return lodashRange(missionCount) as Mission.Index[];
      }
    }
    export type Outcome = 'success' | 'fail';
    export type Bid = Outcome;
    export type Result = {
      readonly successBidCount: number;
      readonly failBidCount: number;
      readonly outcome: Outcome;
    };
    export type Status = Status.Current | Status.Past | Status.Future;
    export namespace Status {
      export type Current = 'current';
      export type Past = 'finished' | 'notNeeded';
      export type Future = 'future';
      export type InPlay = Current | 'finished';
    }

    export type Rounds = {
      readonly [_ in Mission.Round.Index]?: Mission.Round;
    };
    export type Round = {
      readonly playersAttributes: Round.PlayersAttributes;
      readonly leader: Player.Index;
      readonly teamStatus: Round.TeamStatus;
    };
    export namespace Round {
      export type PlayersAttributes = {
        readonly [_ in Game.Player.Index]?: Round.PlayerAttributes;
      };
      export type PlayerAttributes = {
        readonly bid?: Mission.Outcome; // The mission 'success' or 'fail' card played.
        readonly inTeam?: true; // Player is in the chosen team or not.
        readonly vote?: Round.Vote;
      };

      export type Status = Status.Current | Status.Past | Status.Future;
      // tslint:disable-next-line: no-shadowed-variable // Lint bug? Qualified names shouldn't be shadowed.
      export namespace Status {
        export type Current = 'current';
        export type Past = 'finished' | 'notNeeded';
        export type Future = 'future';
        export type InPlay = Current | 'finished';
      }
      export type TeamStatus = 'tentative' | 'decided';
      export type ProgressState =
        | 'choosingTeam'
        | 'decidedTeam'
        | 'finishedVoting'
        | 'finishedMission';
      export type Progress = ProgressState[]; // Consist of current and all previously passed states.

      export type Count = 5;
      // tslint:disable-next-line: no-shadowed-variable // It looks like a linting bug? See previous occurrence.
      export const count: Count = 5;
      export type Index = 0 | 1 | 2 | 3 | 4;
      // tslint:disable-next-line: no-shadowed-variable // Ugh idk.
      export namespace Index {
        export function range(roundCount: number): Round.Index[] {
          return lodashRange(roundCount) as Round.Index[];
        }
      }
      export type Vote = 'approve' | 'reject';
    }
  }

  export type Finish = {
    lastLeader: Player.Index;
    winningFaction: Player.Faction;
  };

  export type Rules = { roleStack: Rules.RoleStack };
  export namespace Rules {
    export type RoleStack = RoleStack.CommanderStack & RoleStack.BlindSpyStack;
    export namespace RoleStack {
      export type CommanderStack = {} | ({ commander: true } & BodyguardStack & DeepCoverStack);
      export type BodyguardStack =
        | {}
        | { bodyguard: true }
        | { bodyguard: true; falseCommander: true };
      export type DeepCoverStack = {} | { deepCover: true };
      export type BlindSpyStack = {} | { blindSpy: true };
    }
  }

  export type Specs = {
    playerCount: Player.Count;
    startingPlayerIndex: Player.Index;
    rules: Rules;
  };
}

export default Game;
