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
  export const dataApi = new Database.SingleDocumentStore<Room.Data>(collectionId);

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
