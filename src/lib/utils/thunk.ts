export type Thunk<T> = T | (() => T);

export function unthunk<T>(t: Thunk<T>)
{
  return t instanceof Function ? t() : t;
}
