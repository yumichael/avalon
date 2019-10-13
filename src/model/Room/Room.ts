import Database from 'src/library/Database';
import Game from '../Game/Game';
import User from '../User/User';
import lodashRange from 'lodash/range';

namespace Room {
  const collectionId = 'rooms';
  export type Id = string;
  export type Ref = Database.DocumentReference;
  export function ref(roomId: Id) {
    return dataApi.makeRefFromId(roomId);
  }
  export type Doc = Database.Document<Room.Data>;
  export const dataApi = (() => {
    // tslint:disable-next-line: no-shadowed-variable
    const dataApi = new Database.SingleDocumentStore<Room.Data>(collectionId);
    dataApi.createRefForNewDoc = (): Database.DocumentReference => {
      const letters = 'abcdefghijkmnpqrstuvwxyz'; // IMPORTANT: missing l, o
      const numbers = '0123456789';
      let result = '';
      for (const _ of lodashRange(3)) {
        result += letters.charAt(Math.floor(Math.random() * letters.length));
        result += numbers.charAt(Math.floor(Math.random() * numbers.length));
        result += numbers.charAt(Math.floor(Math.random() * numbers.length));
      }
      result += letters.charAt(Math.floor(Math.random() * letters.length));
      result += getLastTwoRoomIdDigits(result);
      return dataApi.makeRefFromId(result);
    };
    return dataApi;
  })();
  function getLastTwoRoomIdDigits(roomId: Id): string | undefined {
    let num = 0;
    num += roomId.charCodeAt(0) * 47;
    num += parseInt(roomId.slice(1, 3)) * 13;
    num += roomId.charCodeAt(3) * 89;
    num += parseInt(roomId.slice(4, 6)) * 97;
    num += roomId.charCodeAt(6) * 29;
    num += parseInt(roomId.slice(7, 9)) * 67;
    num += roomId.charCodeAt(9) * 7;
    num %= 100;
    if (isNaN(num)) {
      return undefined;
    }
    return num.toString();
  }
  export function isValidRoomId(roomId: Id): boolean {
    if (roomId.length !== 12) {
      return false;
    }
    const result: boolean[] = [];
    for (const j of lodashRange(4)) {
      const i = j * 3;
      result.push('a' <= roomId[i] && roomId[i] <= 'z' && !!!['l', 'o'].includes(roomId[i]));
      result.push('0' <= roomId[i + 1] && roomId[i + 1] <= '9');
      result.push('0' <= roomId[i + 2] && roomId[i + 2] <= '9');
    }
    return result.every(_ => _) && roomId.slice(10, 12) === getLastTwoRoomIdDigits(roomId);
  }

  // This is the data that is to be synced with Firestore.
  export type Data = {
    readonly users: UsersPresences;
    readonly seats: Seats;
    readonly playing?: Playing;
    readonly usersPowers?: UsersPowers;
    readonly director: User.Ref;
    readonly chat: Chat;
  };
  export namespace Data {
    export type State = 'ready' | 'loading';
    export function getSeatKey(seatIndex: Seat.Index): string {
      return `seats.${seatIndex}`;
    }
    export namespace getSeatKey {
      export type valueType = Seat;
    }
    export function getUserPresenceKey(userRef: User.Ref): string {
      return `users.${userRef.id}`;
    }
    export namespace getUserPresenceKey {
      export type valueType = UserPresence;
    }
  }

  export type Seats = { readonly [_ in Seat.Index]?: Seat };
  export type MutableSeats = { [_ in Seat.Index]?: Seat };
  export type Seat = {
    readonly userRef?: User.Ref;
  };
  export namespace Seat {
    export const defaultValue: Seat = {};
    export type Index = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
    export namespace Index {
      export function range(seatCount: number): Seat.Index[] {
        return lodashRange(seatCount) as Seat.Index[];
      }
    }
    export type Count = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
    export namespace Count {
      export const max = 10;
      // tslint:disable-next-line: no-shadowed-variable
      export const defaultValue = 10;
    }
  }

  export type UserStatus = 'seated' | 'standing' | 'out';
  export type UserPresence = 'joined';
  export type UsersPresences = { readonly [_ in User.Id]?: UserPresence };

  export type UsersPowers = { readonly [_ in User.Id]?: UserPowers };
  export type UserPowers = {
    readonly [_ in keyof UserPowers.Complete]?: UserPowers.Complete[_];
  };
  export namespace UserPowers {
    export type Complete = {
      readonly canJoin: boolean;
      readonly canLeave: boolean;
      readonly canInvite: boolean;
      readonly canRemoveOthers: boolean;
      readonly canSetDirector: boolean;
      readonly canSit: boolean;
      readonly canStand: boolean;
      readonly canSetSeatCount: boolean;
      readonly canArrangeSeats: boolean;
      readonly canProposeGame: boolean;
      readonly canStartGame: boolean;
      readonly canDestroyRoom: boolean;
    };
    export const defaultValues: Complete = {
      canJoin: true,
      canLeave: true,
      canInvite: true,
      canRemoveOthers: false,
      canSetDirector: false,
      canSit: true,
      canStand: true,
      canSetSeatCount: false,
      canArrangeSeats: false,
      canProposeGame: true,
      canStartGame: false,
      canDestroyRoom: false,
    };
    export const directorValues: Complete = {
      canJoin: true,
      canLeave: false,
      canInvite: true,
      canRemoveOthers: true,
      canSetDirector: true,
      canSit: true,
      canStand: true,
      canSetSeatCount: true,
      canArrangeSeats: true,
      canProposeGame: true,
      canStartGame: true,
      canDestroyRoom: true,
    };
  }

  export type Playing = {
    readonly gameRef: Game.Ref;
    readonly userToPlayerMap: Playing.UserToPlayerMap;
    readonly host: User.Ref;
    readonly finish?: Playing.Finish;
  };
  export namespace Playing {
    export type UserToPlayerMap = { [_ in User.Id]?: Game.Player.Index };
    export type Finish = {
      lastPlayerUserRef?: User.Ref;
      winningFaction?: Game.Player.Faction;
    };
  }

  export type Chat = {
    [messageId in Message.Id]: Message;
  };
  export type Message = {
    text: string;
    userRef: User.Ref;
    timestamp: Database.Timestamp;
  };
  export namespace Message {
    export type Id = string;
    export const maxCount = 50;
  }
}

export default Room;
