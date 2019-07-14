// tslint:disable: ban-types
export type ObjectMetadata = {
  name: string;
};
export type FunctionWrapper = <TheFunction extends Function>(
  _: TheFunction,
) => TheFunction;
export type ClassWrapper = <TFunction extends Function>(
  target: TFunction,
) => TFunction;
