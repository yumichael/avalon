import { firestore } from 'firebase';
import * as firestorter from 'firestorter';
import {
  loggedConstructor,
  loggedMethodBase,
  loggedLoggingWrapper,
  loggingEnabled,
  loggingDisabled,
} from './logging/loggers';
import Logging from './logging/Logging';

export let loggedDatabaseMethod = (specs?: Logging.Specs) => loggedMethodBase(specs);
loggedDatabaseMethod = loggedLoggingWrapper()(loggedDatabaseMethod, {
  ...loggingDisabled,
});

class Database {}
namespace Database {
  export const Document = firestorter.Document;
  export type Document<T extends object> = firestorter.Document<T>;
  export const DocumentReference = firestore.DocumentReference;
  export type DocumentReference = firestore.DocumentReference;
  export const CollectionReference = firestore.CollectionReference;
  export type CollectionReference = firestore.CollectionReference;

  export const FieldValue = firestore.FieldValue;
  export const Timestamp = firestore.Timestamp;
  export type Timestamp = firestore.Timestamp;

  // This class really desperately wants to be entirely supplanted by just a simple WeakMap.
  @loggedConstructor()
  export class SingleDocumentStore<T extends object> {
    private doc?: Document<T>;
    readonly collectionId: string;
    constructor(collectionId: string) {
      this.collectionId = collectionId;
    }
    // If this class were a WeakMap this method would just be refactored out as an independent function.
    @loggedDatabaseMethod({ ...loggingEnabled })
    createRefForNewDoc(): DocumentReference {
      return firestore()
        .collection(this.collectionId)
        .doc();
    }
    @loggedDatabaseMethod({ ...loggingDisabled })
    makeRefFromId(id: string) {
      return firestore()
        .collection(this.collectionId)
        .doc(id);
    }
    @loggedDatabaseMethod({ ...loggingEnabled })
    openNewDoc(documentRef: DocumentReference): Document<T> {
      if (!!!(this.doc && this.doc.ref && this.doc.ref.isEqual(documentRef))) {
        this.doc = new Document<T>(this.collectionId + '/' + documentRef.id);
        // (this.doc as any).docId = makeRandomString({ length: 8 });
      }
      // if (this.collectionId === 'games') {
      //   console.log({
      //     call: `dataApi.openNewDoc(path=${documentRef.path})`,
      //     path: this.doc.path,
      //     docId: (this.doc as any).docId,
      //   });
      // }
      return this.doc;
    }
    @loggedDatabaseMethod({ ...loggingEnabled })
    openUntrackedDoc(documentRef: DocumentReference): Document<T> {
      return new Document<T>(this.collectionId + '/' + documentRef.id);
      // ($return as any).docId = makeRandomString({ length: 8 });
      // if (this.collectionId === 'games') {
      //   console.log({
      //     call: `dataApi.openUntrackedDock(path=${documentRef.path})`,
      //     path: $return.path,
      //     docId: ($return as any).docId,
      //   });
      // }
    }
    @loggedDatabaseMethod()
    getCurrentlyOpenedDoc(documentRef?: DocumentReference): Document<T> | undefined {
      // NOTE if I'm not getting the current doc it's probably just due to some lagging UI component that won't matter soon.
      // invariant(
      //   this.doc && this.doc.ref && (!!!documentRef || this.doc.ref.isEqual(documentRef)),
      //   'Tried to get the current document but given ID does not match that of the current one.',
      // );
      if (!!!this.doc || !!!this.doc.ref || (documentRef && !!!this.doc.ref.isEqual(documentRef))) {
        return undefined;
      }

      // if (this.collectionId === 'games') {
      //   console.log({
      //     call: `dataApi.getCurrentlyOpenedDoc(${documentRef ? `path=${documentRef.path}` : ''})`,
      //     path: this.doc.path,
      //     docId: (this.doc as any).docId,
      //   });
      // }
      return this.doc;
    }
  }
}

export default Database;
