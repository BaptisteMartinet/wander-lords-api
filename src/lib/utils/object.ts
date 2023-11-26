export function mapRecord<T, U>(obj: Record<string, T>, fn: (value: T) => U) {
  const newObj: Record<string, U> = {};
  for (const key in obj) {
    const value = obj[key];
    newObj[key] = fn(value);
  }
  return newObj;
}

export function filterRecord<T>(obj: Record<string, T>, fn: (value: T) => boolean) {
  const newObj: Record<string, T> = {};
  for (const key in obj) {
    const value = obj[key];
    if (fn(value))
      newObj[key] = value;
  }
  return newObj;
}
