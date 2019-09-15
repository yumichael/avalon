import {
  DependencyList,
  MutableRefObject,
  useRef,
  useEffect,
  useState,
  useCallback,
  useMemo,
  Dispatch,
  SetStateAction,
} from 'react';
import { Keyboard, KeyboardEventListener } from 'react-native';
import { invariant } from '../exceptions/exceptions';

export function useHardMemo<T>(update: (current: T) => T, deps: DependencyList | undefined) {
  const ref: MutableRefObject<T> = useRef<T>() as MutableRefObject<T>;
  useMemo(() => {
    ref.current = update(ref.current);
  }, deps);
  return ref.current;
}

// https://reactjs.org/docs/hooks-faq.html#how-to-read-an-often-changing-value-from-usecallback
export function useEventCallback<T extends (...args: any[]) => any>(
  fn: T,
  deps: DependencyList | undefined,
) {
  const ref = useRef<T>(((() =>
    invariant(false, 'Cannot call an event handler while rendering.')) as unknown) as T);

  useEffect(() => {
    ref.current = fn;
  }, [fn, ...(deps || [])]);

  return useCallback(() => {
    return ref.current();
  }, [ref]);
}

// https://github.com/react-native-community/react-native-hooks/blob/master/lib/useKeyboard.js
export const useKeyboard = () => {
  const [keyboard, setKeyboard] = useState<{ height: number } | undefined>(undefined);

  const keyboardWillShow: KeyboardEventListener = e => {
    setKeyboard({
      height: e.endCoordinates.height,
    });
  };

  const keyboardWillHide: KeyboardEventListener = e => {
    setKeyboard(undefined);
  };

  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', keyboardWillShow);
    const keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', keyboardWillHide);

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, []);
  return keyboard;
};

// Deprecated
export type UsingStates<S> = { [name in keyof S]: [S[name], Dispatch<SetStateAction<S[name]>>] };
// NOTE in using this hook the initial state must have all keys present always.
export function useStates<S extends object>(
  initialStates: S /*| { [name in keyof S]: (() => S[name]) }*/,
): UsingStates<S> {
  const states: {
    [name in keyof S]: [S[name], Dispatch<SetStateAction<S[name]>>];
  } = (Object.fromEntries(
    (Object.keys(initialStates) as Array<keyof S>)
      .sort()
      .map(name => [name, useState(initialStates[name])]),
  ) as unknown) as any;
  return useMemo(
    () => states,
    (Object.values(states) as Array<[unknown, unknown]>).map(([state, setState]) => state),
  );
}
