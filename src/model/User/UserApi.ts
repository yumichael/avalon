import UserActivity from './UserActivity';
import User from './User';
import Database from 'src/library/Database';
import DocApi from 'src/library/patterns/DocApi';
import Room from '../Room/Room';
import RoomApi from '../Room/RoomApi';
import {
  loggedMethod,
  loggedConstructor,
  logged,
  loggingBody,
} from 'src/library/logging/loggers';

const { FieldValue } = Database;

@loggedConstructor()
class UserApi implements DocApi<User.Ref> {
  readonly ref: User.Ref;
  private get doc(): Database.Document<User.Data> {
    return User.dataApi.getCurrentlyOpenedDoc(this.ref)!;
  }
  private readonly contract: DocApi.WillWaitUntilDocHasDataContract;

  @loggedMethod()
  static initiate(specs: UserApi.Specs): UserApi.Initiator {
    return new UserApi.Initiator(specs);
  }

  constructor(
    contract: DocApi.WillWaitUntilDocHasDataContract,
    specs: UserApi.Specs,
  ) {
    this.contract = contract;
    User.dataApi.openNewDoc(specs.userRef);
    this.ref = specs.userRef;
    // console.groupEnd();
  }

  @loggedMethod()
  getDataState(this: UserApi): User.Data.State {
    return this.doc.hasData ? 'ready' : 'loading';
  }

  // ATTENTION! Every method below MUST NOT be called before the data is synced from Firebase.

  getDisplayName(): string {
    return this.doc.data.displayName;
  }

  canOpenAndEnterNewRoom(): boolean {
    if (this.doc.data.activity && this.doc.data.activity.roomRef) {
      return false;
    }
    return true;
  }

  openAndEnterNewRoom(): UserApi.Feedback {
    if (!!!this.canOpenAndEnterNewRoom()) {
      return 'cannot';
    }
    const roomRef = Room.dataApi.createRefForNewDoc();
    RoomApi.setupNewRoom(roomRef, this.ref, Room.Seat.Count.defaultValue);
    return this.enterRoom(roomRef);
  }

  canEnterRoom(roomRef?: Room.Ref): boolean {
    if (
      this.doc.data.activity &&
      this.doc.data.activity.roomRef &&
      (!!!roomRef || !!!this.doc.data.activity.roomRef.isEqual(roomRef))
    ) {
      return false;
    }
    return true;
  }

  enterRoom(roomRef: Room.Ref): UserApi.Feedback {
    if (!!!this.canEnterRoom()) {
      return 'cannot';
    }
    if (
      !!!this.doc.data.activity ||
      !!!this.doc.data.activity.roomRef.isEqual(roomRef)
    ) {
      const activity: User.Data['activity'] = { roomRef };
      this.doc.update({ activity });
    }
    return 'attempted';
  }

  canExitRoom(roomRef?: Room.Ref): boolean {
    if (
      !!!this.doc.data.activity ||
      !!!this.doc.data.activity.roomRef ||
      (roomRef && !!!this.doc.data.activity.roomRef.isEqual(roomRef))
    ) {
      return false;
    }
    return true;
  }

  exitRoom(roomRef?: Room.Ref): UserApi.Feedback {
    if (!!!this.canExitRoom(roomRef)) {
      return 'cannot';
    }
    const activity: User.Data['activity'] = (FieldValue.delete() as unknown) as undefined;
    this.doc.update({ activity });
    return 'attempted';
  }

  private userActivity?: UserActivity;
  @loggedMethod({ ...loggingBody })
  get activity(): UserActivity | undefined {
    const activityData = this.doc.data.activity;
    if (!!!activityData) {
      logged({ $path: '`!!!activityData`' });
      this.userActivity = undefined;
    } else {
      const { roomRef } = activityData;
      if (
        !!!this.userActivity ||
        (this.userActivity &&
          !!!roomRef.isEqual(this.userActivity.getRoomRef()))
      ) {
        logged({ $path: '`new UserActivity`' });
        this.userActivity = new UserActivity(this.contract, this.ref);
      } else {
        logged({ $path: null });
      }
    }
    return this.userActivity;
  }
}
namespace UserApi {
  export type Feedback = 'attempted' | Feedback.Cannot;
  export namespace Feedback {
    export type Cannot = 'cannot';
  }

  export class Initiator extends DocApi.Initiator.createSubclass<
    User.Ref,
    UserApi,
    UserApi.Specs
  >(UserApi) {}
  export type Specs = {
    userRef: User.Ref;
  };
}

export default UserApi;
