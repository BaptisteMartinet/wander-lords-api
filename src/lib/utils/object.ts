export function mapRecord<K extends string, T, U>(obj: Record<K, T>, fn: (value: T) => U) {
  const newObj = {} as Record<K, U>;

  for (const key in obj) {
    const value = obj[key];
    newObj[key] = fn(value);
  }
  return newObj;
}

export function filterRecord<K extends string, U, T extends Record<K, U>>(obj: T, fn: (value: U) => boolean) {
  const newObj: Partial<T> = {};
  for (const key in obj) {
    const value = obj[key];
    if (fn(value))
      newObj[key] = value;
  }
  return newObj;
}
