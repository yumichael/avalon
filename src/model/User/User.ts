import Database from 'src/library/Database';
import Room from '../Room/Room';
import { observable, runInAction } from 'mobx';

// TODO will need to refactor this.
class UserData {
  @observable readonly users: { [_ in User.Id]?: { avatarUri: string } | 'loading' } = {};
}
const userData = new UserData();
export function getUserAvatarUri(userRef: User.Ref): string | undefined {
  const users = userData.users;
  const user = users[userRef.id];
  if (user === undefined) {
    runInAction(() => {
      users[userRef.id] = 'loading';
    });
    fetch('https://randomuser.me/api/?inc=picture')
      .then(res => {
        // console.log('res = ' + detailAsString(res));
        return res.json();
      })
      .then((obj: any) => {
        runInAction(() => {
          users[userRef.id] = { avatarUri: obj.results[0].picture.large };
        });
      })
      .catch(reason => {
        // console.log('bad = ' + reason);
      });
  } else if (user !== 'loading') {
    return user.avatarUri;
  }
  return 'https://randomuser.me/api/portraits/men/65.jpg';
}

namespace User {
  const collectionId = 'users';
  export type Id = string;
  export type Ref = Database.DocumentReference;
  export function ref(userId: Id) {
    return dataApi.makeRefFromId(userId);
  }
  export type Doc = Database.Document<User.Data>;
  export const dataApi = new Database.SingleDocumentStore<User.Data>(collectionId);

  // This is the data that is to be synced with Firestore.
  export type Data = {
    readonly displayName: string;
    readonly activity?: Activity;
  };
  export namespace Data {
    export type State = 'ready' | 'loading';
  }

  export type Activity = {
    readonly roomRef: Room.Ref;
  };
}

export default User;
