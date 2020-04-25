import Database from 'src/library/Database';
import Room from '../Room/Room';

export function getUserAvatarUri(userRef: User.Ref, height?: number): string | undefined {
  if (height === undefined || height === null) {
    return `https://graph.facebook.com/${userRef.id}/picture?type=large`;
  } else {
    return `https://graph.facebook.com/${userRef.id}/picture?height=${Math.round(height)}`;
  }
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
