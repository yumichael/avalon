import { ObjectMetadata } from './typingHelp';

// tslint:disable: ban-types

// This function is used solely to get Typescript to make sure the expression used as the argument
// passes type checking.
// tslint:disable-next-line: no-empty
export function useExpressionForTypeChecking<T>(expression: () => T) {}

export const noOp = () => null;

export function copyObjectMetadata(target: Function, source: Function, forceData?: ObjectMetadata) {
  try {
    Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
  } catch (error) {
    console.groupCollapsed('`copyObjectMetadata` failed to copy all metadata to target.');
    Object.entries(Object.getOwnPropertyDescriptors(source)).forEach(([key, value]) => {
      try {
        Object.defineProperty(target, key, value);
      } catch (e) {
        console.warn(e);
      }
    });
    console.groupEnd();
  }
  if (forceData && forceData.name) {
    Object.defineProperty(target, 'name', {
      configurable: true,
      enumerable: false,
      value: forceData.name,
      writable: false,
    });
  }
}

export namespace Inspect {
  export type Options = {
    depth?: number;
    maxArrayLength?: number;
  };
  export namespace Options {
    export type Complete = {
      depth: number;
      maxArrayLength: number;
    };
    export const defaultValues: Complete = {
      depth: 2,
      maxArrayLength: 5,
    };
  }

  export function recur(o: Object, options: Options.Complete, depthOverload?: number): string {
    const inspectPrimitive = JSON.stringify;
    const depth = depthOverload !== undefined ? depthOverload : options.depth;
    if (['string', 'number', 'bigint', 'boolean', 'symbol', 'undefined'].includes(typeof o)) {
      return inspectPrimitive(o);
    } else if (Array.isArray(o)) {
      const maxArrayLength = depth === 0 ? 0 : options.maxArrayLength;
      const sliced = o.length <= maxArrayLength ? o : o.slice(0, maxArrayLength);
      const toShowPart = sliced.map(value => recur(value, options, depth - 1)).join(', ');
      const toSkipPart = o.length > sliced.length ? `...<${o.length - sliced.length} more>` : '';
      return `[${toShowPart}${toShowPart && toSkipPart ? ', ' : ''}${toSkipPart}]`;
    } else {
      if (depth === 0) {
        return `{...}`;
      } else {
        return `{${Object.entries(o)
          .map(([key, value]) => {
            return `${key}: ${recur(value, options, depth - 1)}`;
          })
          .join(', ')}}`;
      }
    }
  }
  // tslint:disable-next-line: no-shadowed-variable
  export function inspect(o: Object, options?: Options): string {
    const optionsToUse: Inspect.Options.Complete = {
      ...Options.defaultValues,
      ...options,
    };
    return recur(o, optionsToUse);
  }
}
export const inspect = Inspect.inspect;

export const summarizeAsString = (o: Object) => inspect(o, { depth: 1, maxArrayLength: 10 });
export const describeAsString = (o: Object) => inspect(o, { depth: 2, maxArrayLength: 50 });
// export const detailAsString = (o: Object) => inspect(o, { showHidden: true, depth: 2 });

export function makeRandomString({ length }: { length: number }) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
