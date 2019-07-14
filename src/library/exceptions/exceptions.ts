import AppError from './AppError';

export function invariant(
  shouldBeTruthy: any,
  message: string,
  ErrorClass: typeof AppError = AppError,
) {
  if (!!!shouldBeTruthy) {
    throw new ErrorClass(message);
  }
}
