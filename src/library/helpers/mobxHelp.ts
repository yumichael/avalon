import React from 'react';
import { observer, IObserverOptions } from 'mobx-react-lite';
import { copyObjectMetadata } from './programmingHelp';

// TODO this file is obsolete
export function observerWithMeta<P extends object>(
  baseComponent: React.FunctionComponent<P>,
  options?: IObserverOptions,
): React.FunctionComponent<P> {
  const returnValue = observer(baseComponent);
  copyObjectMetadata(returnValue, baseComponent);
  return returnValue;
}
