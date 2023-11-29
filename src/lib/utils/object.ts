export function mapRecord<
  KeyType extends string,
  ValueType,
  OutputType,
>(obj: Record<KeyType, ValueType>, fn: (value: ValueType) => OutputType) {
  const newObj = {} as Record<KeyType, OutputType>;
  for (const key in obj) {
    const value = obj[key];
    newObj[key] = fn(value);
  }
  return newObj;
}

export function filterRecord<K extends string, V>(obj: Record<K, V>, fn: (value: V) => boolean) {
  const newObj: Partial<Record<K, V>> = {};
  for (const key in obj) {
    const value = obj[key];
    if (fn(value))
      newObj[key] = value;
  }
  return newObj;
}
