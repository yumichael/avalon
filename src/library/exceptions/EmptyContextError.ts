import { invariant } from './exceptions';
import AppError from './AppError';
class EmptyContextError extends AppError {}
namespace EmptyContextError {
  export function throwOnUse<T>(
    throwawayTemplate: { [_ in keyof T]: any },
  ): { [_ in keyof T]: any } {
    Object.keys(throwawayTemplate).forEach(key => {
      Object.defineProperty(throwawayTemplate, key, {
        get: () =>
          invariant(false, `property name "${key}"`, EmptyContextError),
      });
    });
    return throwawayTemplate;
  }
}

export default EmptyContextError;
