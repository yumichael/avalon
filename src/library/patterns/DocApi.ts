import { Contract } from '../patterns/Contracts';
import { loggedMethod, loggedConstructor, logged, loggingBody } from '../logging/loggers';
import Database from '../Database';

interface DocApi<DocRef extends Database.DocumentReference, Data extends object> {
  readonly ref: DocRef;
  getDataState(): DocApi.DataState;
  readonly doc: Database.Document<Data>;
}
namespace DocApi {
  export type DataState = 'ready' | 'loading';
  export class WillWaitUntilDocHasDataContract implements Contract {
    private constructor() {}
  }
  const theContract = new (WillWaitUntilDocHasDataContract as any)() as WillWaitUntilDocHasDataContract;
  @loggedConstructor()
  export abstract class Initiator<
    TheDocRef extends Database.DocumentReference,
    TheData extends object,
    TheDocApi extends DocApi<TheDocRef, TheData>,
    ApiSpecs extends {}
  > {
    get ref() {
      return this.instance.ref;
    }
    private readonly instance: TheDocApi;
    constructor(docApi: TheDocApi) {
      this.instance = docApi;
      // (this as any).docApiId = makeRandomString({ length: 8 });
      // console.log({
      //   call: `new Initiator(path=${docApi.ref.path})`,
      //   path: this.ref.path,
      //   docApiId: (this as any).docApiId,
      //   docId: (this.instance as any).doc.docId,
      // });
    }
    @loggedMethod({ ...loggingBody })
    get readyInstance(): TheDocApi | undefined {
      // WTF apparently (2019-06-10) firestorter doc can go from `.hasData` to `!!!.hasData` if the document updates.
      if (this.instance.getDataState() === 'ready') {
        logged({ $path: "`=== 'ready'`" });
        // console.log({
        //   call: `Initiator.readyInstance`,
        //   path: this.ref.path,
        //   docApiId: (this as any).docApiId,
        //   docId: (this.instance as any).doc.docId,
        //   status: 'ready',
        // });
        return this.instance;
      } else {
        logged({ $path: "`!== 'ready'`" });
        // console.log({
        //   call: `Initiator.readyInstance`,
        //   path: this.ref.path,
        //   docApiId: (this as any).docApiId,
        //   docId: (this.instance as any).doc.docId,
        //   status: 'notReady',
        // });
        return undefined;
      }
    }
    runOnReady(
      onFulfilled: (api: TheDocApi) => TheDocApi | PromiseLike<TheDocApi>,
      onRejected?: (reason: any) => PromiseLike<never>,
    ): Promise<TheDocApi> {
      return this.instance.doc.fetch().then(() => onFulfilled(this.instance), onRejected);
    }
  }
  export namespace Initiator {
    export function createSubclass<
      TheDocRef extends Database.DocumentReference,
      TheData extends object,
      TheDocApi extends DocApi<TheDocRef, TheData>,
      ApiSpecs extends {}
    >(TheDocApi: new (contract: WillWaitUntilDocHasDataContract, specs: ApiSpecs) => TheDocApi) {
      @loggedConstructor()
      class MyInitiator extends Initiator<TheDocRef, TheData, TheDocApi, ApiSpecs> {
        constructor(specs: ApiSpecs) {
          super(new TheDocApi(theContract, specs));
        }
      }
      return MyInitiator;
    }
  }
}

export default DocApi;
