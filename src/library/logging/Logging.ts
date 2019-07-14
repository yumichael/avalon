namespace Logging {
  export type Specs = Specs.Enabled | Specs.Disabled;
  export namespace Specs {
    export type Enabled = {
      name?: string;
      logCall?: true;
      logAsGroup?: false | 'group' | 'groupCollapsed';
      logArguments?: true;
      logBody?: true;
      logReturnedValue?: boolean;
      disable?: false;
    };
    export type Disabled = { disable: true };
    const defaultValues: Specs = {
      logReturnedValue: true,
      logAsGroup: 'groupCollapsed',
      logCall: true,
      logArguments: true,
      logBody: true,
    };
    export function isEnabled(specs: Enabled | Disabled): specs is Enabled {
      return !!!specs.disable;
    }
    // TODO functionalize `Room`'s `userPowers` defaults like this. Also do a search for "default" and functionalize anything else.
    export function resolve(...specsList: Array<Specs | undefined>): Specs {
      let specs: Specs = { ...defaultValues };
      for (const newSpecs of specsList) {
        if (newSpecs !== undefined) {
          // tslint:disable-next-line: no-bitwise
          if ((Specs.isEnabled(specs) ? 1 : 0) ^ (Specs.isEnabled(specs) ? 1 : 0)) {
            specs = { ...newSpecs };
          } else {
            Object.assign(specs, newSpecs);
          }
        }
      }
      return specs;
    }
  }
  export type Entry = {
    $call?: string;
    $body?: string;
    $return?: any;
    [variableName: string]: any;
  };
}

export default Logging;
