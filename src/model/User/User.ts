import Database from 'src/library/Database';
import Room from '../Room/Room';

namespace User {
  const collectionId = 'users';
  export type Id = string;
  export type Ref = Database.DocumentReference;
  export function ref(userId: Id) {
    return dataApi.makeRefFromId(userId);
  }
  export type Doc = Database.Document<User.Data>;
  export const dataApi = new Database.SingleDocumentStore<User.Data>(
    collectionId,
  );

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
