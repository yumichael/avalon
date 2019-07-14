import UserApi from 'src/model/User/UserApi';
import { createContext } from 'react';
import EmptyContextError from 'src/library/exceptions/EmptyContextError';

// Must not use these contexts uninitialized!

export type UserContextValue = {
  readonly userApiInit: UserApi.Initiator;
};
export const UserContext = createContext<UserContextValue>(
  EmptyContextError.throwOnUse({ userApiInit: undefined }),
);
