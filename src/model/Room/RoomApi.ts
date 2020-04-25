import Room from './Room';
import Database from 'src/library/Database';
import User from '../User/User';
import size from 'lodash/size';
import sum from 'lodash/sum';
import mapKeys from 'lodash/mapKeys';
import Game from '../Game/Game';
import GameApi from '../Game/GameApi';
import DocApi from 'src/library/patterns/DocApi';
import RoomPlaying from './RoomPlaying';
import { loggedConstructor, loggedMethod, loggingDisabled } from 'src/library/logging/loggers';
import { makeRandomString } from 'src/library/helpers/programmingHelp';
import range from 'lodash/range';

/* This class represents the API for a specific user interacting with a room.
 */
@loggedConstructor()
class RoomApi implements DocApi<Room.Ref, Room.Data> {
  readonly userRef: User.Ref;
  readonly ref: Room.Ref;
  get doc(): Database.Document<Room.Data> {
    return Room.dataApi.getCurrentlyOpenedDoc(this.ref)!;
  }
  private readonly contract: DocApi.WillWaitUntilDocHasDataContract;

  @loggedMethod()
  static setupNewRoom(roomRef: Room.Ref, director: User.Ref, seatCount: Room.Seat.Count) {
    const roomDoc = Room.dataApi.openUntrackedDoc(roomRef);
    const seats: Room.Data['seats'] = Object.assign(
      {},
      Room.Seat.Index.range(seatCount).map(i => Room.Seat.defaultValue) as Room.Seats,
    );
    const init: Room.Data = {
      users: { [director.id]: 'joined' },
      userProperties: {},
      director,
      seats,
      chat: {},
      lastUserOpenRoomTimestamp: (Database.FieldValue.serverTimestamp() as unknown) as Database.Timestamp,
    };
    roomDoc.set(init);
  }

  @loggedMethod()
  static initiate(specs: RoomApi.Specs): RoomApi.Initiator {
    return new RoomApi.Initiator(specs);
  }

  constructor(contract: DocApi.WillWaitUntilDocHasDataContract, specs: RoomApi.Specs) {
    this.contract = contract;
    Room.dataApi.openNewDoc(specs.roomRef);
    this.ref = specs.roomRef;
    this.userRef = specs.userRef;
    const { displayName } = specs.userProperties;
    const presenceKey = Room.Data.getUserPresenceKey(this.userRef);
    const presenceData: Room.Data.getUserPresenceKey.valueType = 'joined';
    const propertyKey = Room.Data.getUserPropertyKey(this.userRef);
    const propertyData: Room.Data.getUserPropertyKey.valueType = { displayName };
    const lastUserOpenRoomTimestamp: Room.Data['lastUserOpenRoomTimestamp'] = (Database.FieldValue.serverTimestamp() as unknown) as Database.Timestamp;
    this.doc.update({
      [presenceKey]: presenceData,
      [propertyKey]: propertyData,
      lastUserOpenRoomTimestamp,
    });
    // console.groupEnd();
  }

  @loggedMethod()
  getDataState(): Room.Data.State {
    return this.doc && this.doc.hasData ? 'ready' : 'loading';
  }

  // ATTENTION! Every method below MUST NOT be called before the data is synced from Firebase.

  // First the view methods.

  getUserName(userRef: User.Ref): string {
    return this.doc.data.userProperties[userRef.id]?.displayName || '[no name]';
  }

  getUserSeatIndex(userRef: User.Ref): Room.Seat.Index | undefined {
    for (const i of Room.Seat.Index.range(this.getSeatCount())) {
      const seat = this.getSeat(i);
      if (seat && seat.userRef && seat.userRef.isEqual(userRef)) {
        return i;
      }
    }
    return undefined;
  }

  getUserStatus(userRef: User.Ref): Room.UserStatus {
    if (!!!this.doc.data.users[userRef.id]) {
      return 'out';
    }
    return this.getUserSeatIndex(this.userRef) !== undefined ? 'seated' : 'standing';
  }

  getSeat(seatIndex: Room.Seat.Index): Room.Seat | undefined {
    return this.doc.data.seats[seatIndex];
  }

  getSeatedCount(): number {
    return sum(Object.values(this.doc.data.seats).map(s => !!s && !!s.userRef));
  }

  getSeatCount(): Room.Seat.Count {
    return size(this.doc.data.seats) as Room.Seat.Count;
  }

  getMaxSeatCount(): Room.Seat.Count {
    return Room.Seat.Count.max;
  }

  getDirector(): User.Ref {
    return this.doc.data.director;
  }

  getUserPowers(userRef: User.Ref): Room.UserPowers.Complete {
    const base = this.getDirector().isEqual(userRef)
      ? Room.UserPowers.directorValues
      : Room.UserPowers.defaultValues;
    return { ...base, ...this.doc.data.usersPowers };
  }

  private messagesMemo: Array<{ id: Room.Message.Id; message: Room.Message }> = [];
  getMessages(): Array<{ id: Room.Message.Id; message: Room.Message }> {
    // For some reason, the chat timestamp data can be null for a split second...
    const messages = Object.entries(this.doc.data.chat).map(([id, message]) => ({ id, message }));
    if (messages.some(({ message }) => !!!message.timestamp)) {
      return this.messagesMemo;
    }
    messages.sort(
      ({ message: a }, { message: b }) => b.timestamp.toMillis() - a.timestamp.toMillis(),
    );
    this.messagesMemo = messages;
    return messages;
  }

  makeUserToPlayerMap(): Room.Playing.UserToPlayerMap {
    const userToPlayerMap: Room.Playing.UserToPlayerMap = {};
    let j: Game.Player.Index = 0;
    for (const i of Room.Seat.Index.range(this.getSeatCount())) {
      const seat = this.getSeat(i);
      if (seat && seat.userRef) {
        userToPlayerMap[seat.userRef.id] = j;
        j = (j + 1) as Game.Player.Index;
      }
    }
    return userToPlayerMap;
  }

  private roomPlaying?: RoomPlaying;
  @loggedMethod({ ...loggingDisabled })
  get playing(): RoomPlaying | undefined {
    const playingData = this.doc.data.playing;
    if (!!!playingData) {
      return (this.roomPlaying = undefined);
    }
    const { gameRef } = playingData;
    if (!!!this.roomPlaying || (this.roomPlaying && !!!gameRef.isEqual(this.roomPlaying.gameRef))) {
      this.roomPlaying = new RoomPlaying(this.contract, this.ref, this.userRef);
    }
    return this.roomPlaying;
  }

  // Now the interaction methods.

  canSetDirector(userRef?: User.Ref): boolean {
    if (!!!this.getUserPowers(this.userRef).canSetDirector) {
      return false;
    }
    return true;
  }

  setDirector(userRefToSet: User.Ref): RoomApi.Feedback {
    if (!!!this.canSetDirector(userRefToSet)) {
      return 'cannot';
    }
    if (!!!this.getDirector().isEqual(userRefToSet)) {
      const director: Room.Data['director'] = userRefToSet;
      this.doc.update({ director });
    }
    return 'attempted';
  }

  canSitAtSeat(seatIndex: Room.Seat.Index): boolean {
    if (
      this.getUserStatus(this.userRef) !== 'standing' ||
      (this.playing && !!!this.playing.getFinish())
    ) {
      return false;
    }
    const seat = this.getSeat(seatIndex);
    if (!!!seat || seat.userRef || !!!this.getUserPowers(this.userRef).canSit) {
      return false;
    }
    return true;
  }

  sitAtSeat(seatIndex: Room.Seat.Index): RoomApi.Feedback {
    if (!!!this.canSitAtSeat(seatIndex)) {
      return 'cannot';
    }
    const seatKey = Room.Data.getSeatKey(seatIndex);
    const seatData: Room.Data.getSeatKey.valueType = { userRef: this.userRef };
    this.doc.update({ [seatKey]: seatData });
    return 'attempted';
  }

  canStandUp(): boolean {
    if (this.getUserStatus(this.userRef) !== 'seated') {
      return false;
    }
    if (this.playing) {
      const playerIndex = this.playing.getPlayerIndexForUser(this.userRef);
      if (playerIndex !== undefined && !!!this.playing.getFinish()) {
        return false;
      }
    }
    return true;
  }

  standUp(): RoomApi.Feedback {
    if (!!!this.canStandUp()) {
      return 'cannot';
    }
    const seatKey = Room.Data.getSeatKey(this.getUserSeatIndex(this.userRef)!);
    const seatData: Room.Data.getSeatKey.valueType = Room.Seat.defaultValue;
    this.doc.update({ [seatKey]: seatData });
    return 'attempted';
  }

  // Post-condition if return `true`: `getSeatedCount()` <= `seatCount` <= `getMaxSeatCount()`.
  canSetSeatCount(newSeatCount?: RoomApi.SeatCountSetterValue): boolean {
    return (
      this.getUserPowers(this.userRef).canSetSeatCount &&
      newSeatCount !== undefined &&
      this.getSeatedCount() <= newSeatCount &&
      newSeatCount <= this.getMaxSeatCount() &&
      newSeatCount !== this.getSeatCount()
    );
  }

  setSeatCount(newSeatCount: RoomApi.SeatCountSetterValue): RoomApi.Feedback {
    if (!!!this.canSetSeatCount(newSeatCount)) {
      return 'cannot';
    }
    let wouldBeSeatCount = this.getSeatCount();
    const newSeats: Room.MutableSeats = {};
    let newI: Room.Seat.Index = 0;
    for (const i of Room.Seat.Index.range(this.getSeatCount())) {
      if (wouldBeSeatCount > newSeatCount && !!!this.getSeat(i)) {
        wouldBeSeatCount = (wouldBeSeatCount - 1) as Room.Seat.Count;
        continue;
      }
      newSeats[newI] = this.getSeat(i);
      newI = (newI + 1) as Room.Seat.Index;
    }
    while (wouldBeSeatCount < newSeatCount) {
      newSeats[newI] = Room.Seat.defaultValue;
      newI = (newI + 1) as Room.Seat.Index;
    }
    const seats: Room.Data['seats'] = newSeats;
    this.doc.update({ seats });
    return 'attempted';
  }

  canArrangeSeats(): boolean {
    return this.getUserPowers(this.userRef).canArrangeSeats;
  }

  canSwapSeats(seatIndex0: Room.Seat.Index, seatIndex1: Room.Seat.Index): boolean {
    if (!!!this.canArrangeSeats()) {
      return false;
    }
    return (
      0 <= Math.min(seatIndex0, seatIndex1) &&
      Math.max(seatIndex0, seatIndex1) <= this.getSeatCount() &&
      seatIndex0 !== seatIndex1
    );
  }

  swapSeats(seatIndex0: Room.Seat.Index, seatIndex1: Room.Seat.Index): RoomApi.Feedback {
    if (!!!this.canSwapSeats(seatIndex0, seatIndex1)) {
      return 'cannot';
    }
    this.doc.update({
      [Room.Data.getSeatKey(seatIndex0)]: this.getSeat(seatIndex1),
      [Room.Data.getSeatKey(seatIndex1)]: this.getSeat(seatIndex0),
    });
    return 'attempted';
  }

  canSeeChat(): boolean {
    return true;
  }

  canSendMessage(text?: string): boolean {
    return true;
  }

  sendMessage(text: string): RoomApi.Feedback {
    if (!!!this.canSendMessage(text)) {
      return 'cannot';
    }
    const id = makeRandomString({ length: 8 });
    const update: Room.Data['chat'] = {};
    const deleteCount = size(this.doc.data.chat) - Room.Message.maxCount;
    if (deleteCount > 0) {
      const messages = this.getMessages();
      for (const {} of range(deleteCount)) {
        update[messages.slice(-1)[0].id] = Database.FieldValue.delete() as any;
      }
    }
    update[id] = {
      userRef: this.userRef,
      timestamp: (Database.FieldValue.serverTimestamp() as unknown) as Database.Timestamp,
      text,
    };
    this.doc.update(mapKeys(update, (_, key) => 'chat.' + key));
    return 'attempted';
  }

  canStartNewGame(
    userToPlayerMap?: Room.Playing.UserToPlayerMap,
    startingPlayerUserRef?: User.Ref,
  ): boolean {
    if (!!!this.getUserPowers(this.userRef).canStartGame) {
      return false;
    }
    if (
      userToPlayerMap &&
      (!!!startingPlayerUserRef || userToPlayerMap[startingPlayerUserRef.id] === undefined)
    ) {
      return false;
    }
    const actualUserToPlayerMap = userToPlayerMap ? userToPlayerMap : this.makeUserToPlayerMap();
    if (
      !!!(
        Game.Player.Count.min <= size(actualUserToPlayerMap) &&
        size(actualUserToPlayerMap) <= Game.Player.Count.max
      )
    ) {
      return false;
    }
    return true;
  }

  @loggedMethod()
  startNewGame(rules: Game.Rules, startingPlayerUserRef?: User.Ref): RoomApi.Feedback {
    // console.groupCollapsed(
    //   `RoomApi.startNewGame(this: ${this}, startingPlayerUserRef: ${startingPlayerUserRef})`,
    // );
    const userToPlayerMap = this.makeUserToPlayerMap();
    if (startingPlayerUserRef && !!!this.canStartNewGame(userToPlayerMap, startingPlayerUserRef)) {
      return 'cannot';
    }
    const previousFinish = this.playing && this.playing.getFinish();
    const givenStartingPlayerIndex = startingPlayerUserRef
      ? userToPlayerMap[startingPlayerUserRef.id]!
      : undefined;
    const previousLastPlayerIndex =
      previousFinish && previousFinish.lastPlayerUserRef
        ? userToPlayerMap[previousFinish.lastPlayerUserRef.id]
        : undefined;
    const naturalStartingPlayerIndex =
      previousLastPlayerIndex !== undefined
        ? (((previousLastPlayerIndex + 1) % size(userToPlayerMap)) as Game.Player.Index)
        : undefined;
    const desiredStartingPlayerIndex =
      givenStartingPlayerIndex !== undefined
        ? givenStartingPlayerIndex
        : naturalStartingPlayerIndex;
    const startingPlayerIndex =
      desiredStartingPlayerIndex !== undefined ? desiredStartingPlayerIndex : 0;
    const specs: Game.Specs = {
      playerCount: size(userToPlayerMap) as Game.Player.Count,
      startingPlayerIndex,
      rules,
    };
    const gameRef = Game.dataApi.createRefForNewDoc();
    GameApi.setupNewGame(gameRef, specs);

    const oldGameRef = this.playing && this.playing.gameRef;
    this.roomPlaying = undefined;

    const playing: Room.Data['playing'] = {
      gameRef,
      userToPlayerMap,
      host: this.userRef,
    };
    this.doc.update({ playing }).then(() => {
      if (oldGameRef) {
        const oldGameDoc = Game.dataApi.openUntrackedDoc(oldGameRef);
        if (oldGameDoc) {
          // TODO wait this does (I mean, "should") not work.
          oldGameDoc.delete();
        }
      }
    });
    return 'attempted';
  }
}
namespace RoomApi {
  export type Feedback = 'attempted' | Feedback.Cannot;
  export namespace Feedback {
    export type Cannot = 'cannot';
  }

  export type SeatCountSetterValue = 'minimum' | Room.Seat.Count;

  export class Initiator extends DocApi.Initiator.createSubclass<
    Room.Ref,
    Room.Data,
    RoomApi,
    RoomApi.Specs
  >(RoomApi) {}
  export type Specs = {
    roomRef: Room.Ref;
    userRef: User.Ref;
    userProperties: {
      displayName: string;
    };
  };
}

export default RoomApi;
