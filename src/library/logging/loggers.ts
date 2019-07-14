import { FunctionWrapper, ClassWrapper } from './../helpers/typingHelp';
import {
  copyObjectMetadata,
  describeAsString,
} from '../helpers/programmingHelp';
import { invariant } from '../exceptions/exceptions';
import Logging from './Logging';

// tslint:disable: ban-types

const loggerMemo: { store: Logging.Entry } = { store: {} };

export const loggedFunctionBase: (
  specs?: Logging.Specs,
) => FunctionWrapper = specsMaybe => <TheFunction extends Function>(
  originalFunction: TheFunction,
) => {
  const specs = Logging.Specs.resolve(specsMaybe);
  if (!!!Logging.Specs.isEnabled(specs)) {
    return originalFunction;
  } else {
    const nameToUse =
      (specs && specs.name ? `(${specs.name})` : '') +
      (originalFunction.name || '');
    const wrappedFunction: typeof originalFunction = ((...args: any[]) => {
      const callLog: Logging.Entry = {
        $call: nameToUse,
      };
      args.forEach((argument, i) => {
        const key =
          argument && argument.name !== undefined
            ? `_${i} [${argument.name}]`
            : `_${i}`;
        callLog[key] = argument;
      });
      (specs.logAsGroup ? console[specs.logAsGroup] : console.log)(callLog);
      if (specs.logBody) {
        const bodyLog: Logging.Entry = { $body: callLog.$call, ...callLog };
        delete bodyLog.$call;
        loggerMemo.store = bodyLog;
      }
      const returnValue = originalFunction.apply(null, args);
      (specs.logReturnedValue ? console.log : () => 0)({
        $return: returnValue,
      });
      (specs.logAsGroup === 'group' || specs.logAsGroup === 'groupCollapsed'
        ? console.groupEnd
        : () => 0)();
      return returnValue;
    }) as any;
    copyObjectMetadata(
      wrappedFunction,
      originalFunction,
      specs && specs.name !== undefined ? { name: specs.name } : undefined,
    );
    return wrappedFunction;
  }
};

export const loggedMethodBase: (
  specs?: Logging.Specs,
) => MethodDecorator = specsMaybe => (
  target: Object,
  propertyKey: string | symbol,
  propertyDescriptor: PropertyDescriptor,
) => {
  const specsOnOff = Logging.Specs.resolve(specsMaybe);
  if (!!!Logging.Specs.isEnabled(specsOnOff)) {
    return;
  } else {
    const specs: Logging.Specs.Enabled = specsOnOff; // Stupid Typescript can't see `specsOnOff` is `Enabled` in the closure later.
    const propertyName: string =
      typeof propertyKey === 'string' ? propertyKey : propertyKey.toString();
    const method = propertyDescriptor.value || propertyDescriptor.get;
    invariant(
      method,
      'Tried to decorate a property that was neither a method nor a getter.',
    );
    function newMethod(this: any, ...args: any[]) {
      const callLog: Logging.Entry = {
        $call: target.constructor.name + '.' + propertyName,
        this: this,
      };
      args.forEach((argument, i) => {
        const key =
          argument.name !== undefined ? `_${i} [${argument.name}]` : `_${i}`;
        callLog[key] = argument;
      });
      (specs.logAsGroup ? console[specs.logAsGroup] : console.log)(callLog);
      if (specs.logBody) {
        const bodyLog: Logging.Entry = { $body: callLog.$call, ...callLog };
        delete bodyLog.$call;
        loggerMemo.store = bodyLog;
      }
      const returnValue = method.apply(this, args);
      (specs.logReturnedValue ? console.log : () => 0)({
        $return: returnValue,
      });
      (specs.logAsGroup === 'group' || specs.logAsGroup === 'groupCollapsed'
        ? console.groupEnd
        : () => 0)();
      return returnValue;
    }
    if (propertyDescriptor.value) {
      propertyDescriptor.value = newMethod;
    } else {
      propertyDescriptor.get = newMethod;
    }
  }
};

export const loggedConstructorBase: (
  specs?: Logging.Specs,
) => ClassWrapper = specsMaybe => (Class: Function) => {
  const specsOnOff = Logging.Specs.resolve(specsMaybe);
  if (!!!Logging.Specs.isEnabled(specsOnOff)) {
    return Class;
  } else {
    const specs: Logging.Specs.Enabled = specsOnOff; // Stupid Typescript can't see `specsOnOff` is `Enabled` in the closure later.
    const nameToUse =
      (specs && specs.name ? `(${specs.name})` : '') + (Class.name || '');
    const callName = 'new ' + nameToUse;

    // https://stackoverflow.com/questions/34411546/how-to-properly-wrap-constructors-with-decorators-in-typescript

    // the new constructor behavior.
    const WrappedClass = class extends (Class as any) {
      constructor(...args: any[]) {
        const callLog: Logging.Entry = {
          $call: callName,
        };
        args.forEach((argument, i) => {
          const key =
            argument.name !== undefined ? `_${i} [${argument.name}]` : `_${i}`;
          callLog[key] = argument;
        });
        (specs.logAsGroup ? console[specs.logAsGroup] : console.log)(callLog);
        if (specs.logBody) {
          const bodyLog: Logging.Entry = { $body: callLog.$call, ...callLog };
          delete bodyLog.$call;
          loggerMemo.store = bodyLog;
        }
        const returnValue = super(...args);
        // TODO Confirm it is standard that constructors return `this`, as experiment shows.
        (specs.logReturnedValue ? console.log : () => 0)({
          $return: returnValue /*, this: this*/,
        });
        (specs.logAsGroup === 'group' || specs.logAsGroup === 'groupCollapsed'
          ? console.groupEnd
          : () => 0)();
      }
    } as any;
    copyObjectMetadata(
      WrappedClass,
      Class,
      specs && specs.name !== undefined ? { name: specs.name } : undefined,
    );
    return WrappedClass;
  }
};

export const loggedLoggingWrapper: (
  specs?: Logging.Specs,
) => <TheWrapper extends Function>(
  wrapperMaker: (wrappingSpecs?: Logging.Specs) => TheWrapper,
  assumedWrappingSpecs?: Logging.Specs,
) => (wrappingSpecs?: Logging.Specs) => TheWrapper = specs => (
  wrapperMaker,
  assumedWrappingSpecs,
) => {
  const wrappedWrapperMaker = (wrappingSpecs?: Logging.Specs) => {
    const wrapper = wrapperMaker(
      Logging.Specs.resolve(assumedWrappingSpecs, wrappingSpecs),
    );
    const wrapperName =
      wrapperMaker.name ||
      (specs && Logging.Specs.isEnabled(specs) && specs.name !== undefined
        ? specs.name
        : '');
    const wrapperSpeccedName = `${wrapperName}(${
      wrappingSpecs !== undefined ? describeAsString(wrappingSpecs) : ''
    })`;
    copyObjectMetadata(wrapper, wrapper, { name: wrapperSpeccedName });
    return loggedFunctionBase(specs)(wrapper);
  };
  copyObjectMetadata(
    wrappedWrapperMaker,
    wrapperMaker,
    specs && Logging.Specs.isEnabled(specs) && specs.name !== undefined
      ? { name: specs.name }
      : undefined,
  );
  return wrappedWrapperMaker;
};

// Set this to `{ disabled: true }` to forcefully turn off logging.
export const loggingEnabled: Logging.Specs = { disable: true };

// Set this to `{ disabled: false }` to force logging.
export const loggingDisabled: Logging.Specs = { disable: true };

export const loggingBody: Logging.Specs = loggingEnabled;

export let loggedFunction = (specs?: Logging.Specs) =>
  loggedFunctionBase(specs);
loggedFunction = loggedLoggingWrapper()(loggedFunction, loggingEnabled);
export let loggedMethod = (specs?: Logging.Specs) => loggedMethodBase(specs);
loggedMethod = loggedLoggingWrapper()(loggedMethod, loggingEnabled);
export let loggedConstructor = (specs?: Logging.Specs) =>
  loggedConstructorBase(specs);
loggedConstructor = loggedLoggingWrapper()(loggedConstructor, loggingEnabled);
export let loggedReactFC = (specs?: Logging.Specs) => loggedFunctionBase(specs);
loggedReactFC = loggedLoggingWrapper()(loggedReactFC, {
  ...loggingDisabled,
  // logReturnedValue: false,
});

export const logged = (...args: any[]) => {
  // TODO couple turning this on/off with `loggingEnabled` and `loggingDisabled`
  // console.log({ ...loggerMemo.store, ...args[0] }, ...args.slice(1));
};
