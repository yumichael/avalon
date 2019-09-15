import Game from './Game';
import GameInformer from './GameInformer';
import DocApi from 'src/library/patterns/DocApi';
import Database from 'src/library/Database';
import { loggedConstructor } from 'src/library/logging/loggers';
const { FieldValue } = Database;

@loggedConstructor()
class GameActor {
  private readonly gameRef: Game.Ref;
  private get doc(): Game.Doc {
    return Game.dataApi.getCurrentlyOpenedDoc(this.gameRef)!;
  }
  private readonly info: GameInformer;
  readonly playerIndex: Game.Player.Index;

  constructor(
    contract: DocApi.WillWaitUntilDocHasDataContract,
    gameRef: Game.Ref,
    playerIndex: Game.Player.Index,
    info: GameInformer,
  ) {
    this.gameRef = gameRef;
    this.info = info;
    this.playerIndex = playerIndex;
  }

  hasSeenRole() {
    const player = this.doc.data.players[this.playerIndex]!;
    return !!player.hasSeenRole;
  }

  seeRole() {
    const value: Game.Data.getPlayerKey.valueType['hasSeenRole'] = true;
    this.doc.update({
      [Game.Data.getPlayerKey(this.playerIndex) + '.hasSeenRole']: value,
    });
  }

  canChooseTeam(missionIndex: Game.Mission.Index, roundIndex: Game.Mission.Round.Index): boolean {
    const { info } = this;
    const [i, j] = info.getLatestMissionAndRoundIndices();
    if (i !== missionIndex || j !== roundIndex) {
      return false;
    }
    if (this.playerIndex !== info.getMissionRoundLeader(i, j)) {
      return false;
    }
    if (info.getMissionRoundTeamStatus(i, j) === 'decided') {
      return false;
    }
    return true;
  }

  canToggleTeamMember(
    missionIndex: Game.Mission.Index,
    roundIndex: Game.Mission.Round.Index,
    candidatePlayerIndex: Game.Player.Index,
  ): boolean {
    const { info } = this;
    const [i, j] = [missionIndex, roundIndex];
    if (!!!this.canChooseTeam(i, j)) {
      return false;
    }
    const candidateAttributesData = info.getMissionRoundPlayerAttributes(
      i,
      j,
      candidatePlayerIndex,
    );
    const candidateAttributes = candidateAttributesData!;
    if (
      !!!candidateAttributes.inTeam &&
      info.getMissionRoundWorkingTeamSize(i, j)! >= info.getTeamSizeForMission(i)
    ) {
      return false;
    }
    return true;
  }

  toggleTeamMember(
    missionIndex: Game.Mission.Index,
    roundIndex: Game.Mission.Round.Index,
    candidatePlayerIndex: Game.Player.Index,
  ): GameActor.Feedback {
    const { info } = this;
    const [i, j, k] = [missionIndex, roundIndex, candidatePlayerIndex];
    if (!!!this.canToggleTeamMember(i, j, k)) {
      return 'cannot';
    }
    // At this point we can assume round `[i, j]` has had its data initialized.
    const { inTeam: inTeamBefore } = info.getMissionRoundPlayerAttributes(i, j, k)!;
    const inTeamAfter: Game.Mission.Round.PlayerAttributes['inTeam'] = inTeamBefore
      ? ((FieldValue.delete() as unknown) as undefined)
      : true;
    const candidateInTeamKey = Game.Data.getMissionRoundPlayerAttributesKey(i, j, k) + '.inTeam';
    const candidateInTeamData: Game.Data.getMissionRoundPlayerAttributesKey.valueType['inTeam'] = inTeamAfter;
    this.doc.update({ [candidateInTeamKey]: candidateInTeamData });
    return 'attempted';
  }

  canDecideOnTeam(missionIndex: Game.Mission.Index, roundIndex: Game.Mission.Round.Index): boolean {
    const { info } = this;
    const [i, j] = [missionIndex, roundIndex];
    if (!!!this.canChooseTeam(i, j)) {
      return false;
    }
    // At this point we can assume `[i, j]` refers to a round with data properly initialized.
    if (info.getMissionRoundWorkingTeamSize(i, j)! !== info.getTeamSizeForMission(i)) {
      return false;
    }
    return true;
  }

  decideOnTeam(
    missionIndex: Game.Mission.Index,
    roundIndex: Game.Mission.Round.Index,
  ): GameActor.Feedback {
    const [i, j] = [missionIndex, roundIndex];
    if (!!!this.canDecideOnTeam(i, j)) {
      return 'cannot';
    }
    const teamStatusKey = Game.Data.getMissionRoundKey(i, j) + '.teamStatus';
    const teamStatusData: Game.Data.getMissionRoundKey.valueType['teamStatus'] = 'decided';
    this.doc.update({ [teamStatusKey]: teamStatusData });
    return 'attempted';
  }

  canSubmitVote(
    missionIndex: Game.Mission.Index,
    roundIndex: Game.Mission.Round.Index,
    vote?: Game.Mission.Round.Vote,
  ): boolean {
    const { info } = this;
    const [i, j] = info.getLatestMissionAndRoundIndices();
    if (i !== missionIndex || j !== roundIndex) {
      return false;
    }
    if (vote === 'reject' && j === info.getRoundCountForMission(i) - 1) {
      return false;
    }
    const myAttributes = info.getMissionRoundPlayerAttributes(i, j, this.playerIndex);
    return !!!(myAttributes as Game.Mission.Round.PlayerAttributes).vote;
  }

  submitVote(
    missionIndex: Game.Mission.Index,
    roundIndex: Game.Mission.Round.Index,
    vote: Game.Mission.Round.Vote,
  ): GameActor.Feedback {
    const [i, j, k] = [missionIndex, roundIndex, this.playerIndex];
    if (!!!this.canSubmitVote(i, j, vote)) {
      return 'cannot';
    }
    const myVoteKey = Game.Data.getMissionRoundPlayerAttributesKey(i, j, k) + '.vote';
    const myVoteData: Game.Data.getMissionRoundPlayerAttributesKey.valueType['vote'] = vote;
    this.doc.update({ [myVoteKey]: myVoteData });
    return 'attempted';
  }

  canSubmitBid(
    missionIndex: Game.Mission.Index,
    roundIndex: Game.Mission.Round.Index,
    bid?: Game.Mission.Bid,
  ): boolean {
    const { info } = this;
    const [i, j] = info.getLatestMissionAndRoundIndices();
    if (i !== missionIndex || j !== roundIndex) {
      return false;
    }
    if (bid === 'fail' && info.getPlayerFaction(this.playerIndex) === 'good') {
      return false;
    }
    const myAttributes = info.getMissionRoundPlayerAttributes(i, j, this.playerIndex);
    const { inTeam, bid: alreadyBid } = myAttributes!;
    return info.getMissionRoundTeamStatus(i, j) === 'decided' && !!!alreadyBid && !!inTeam;
  }
  submitBid(
    missionIndex: Game.Mission.Index,
    roundIndex: Game.Mission.Round.Index,
    bid: Game.Mission.Bid,
  ): GameActor.Feedback {
    const [i, j, k] = [missionIndex, roundIndex, this.playerIndex];
    if (!!!this.canSubmitBid(i, j, bid)) {
      return 'cannot';
    }
    const myBidKey = Game.Data.getMissionRoundPlayerAttributesKey(i, j, k) + '.bid';
    const myBidData: Game.Data.getMissionRoundPlayerAttributesKey.valueType['bid'] = bid;
    this.doc.update({ [myBidKey]: myBidData });
    return 'attempted';
  }
}
namespace GameActor {
  export type Feedback = 'attempted' | Feedback.Cannot;
  export namespace Feedback {
    export type Cannot = 'cannot';
  }
}

export default GameActor;
