import Room from './../Room/Room';
import Database from 'src/library/Database';
import User from '../User/User';
import DocApi from 'src/library/patterns/DocApi';
import { loggedConstructor } from 'src/library/logging/loggers';

@loggedConstructor()
class UserActivity {
  readonly ref: User.Ref;
  readonly roomRef: Room.Ref;
  private get doc(): Database.Document<User.Data> {
    return User.dataApi.getCurrentlyOpenedDoc(this.ref)!;
  }
  private get data(): User.Activity {
    return this.doc.data.activity!;
  }
  // private getDataKey(): string {
  //   return 'activity';
  // }

  constructor(contract: DocApi.WillWaitUntilDocHasDataContract, userRef: User.Ref) {
    this.ref = userRef;
    this.roomRef = this.data.roomRef;
    // console.groupEnd();
  }

  getRoomRef(): Room.Ref {
    return this.data.roomRef;
  }
}
namespace UserActivity {
  export type Feedback = 'attempted' | Feedback.Cannot;
  export namespace Feedback {
    export type Cannot = 'cannot';
  }
}

export default UserActivity;
