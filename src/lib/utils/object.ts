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

export function filterRecord<K extends string, V>(obj: Record<K, V>, fn: (value: V, key: K) => boolean) {
  const newObj: Partial<Record<K, V>> = {};
  for (const key in obj) {
    const value = obj[key];
    if (fn(value, key))
      newObj[key] = value;
  }
  return newObj;
}

export function makeRecordFromEntries<K extends string, V>(entries: Iterable<[ K, V ]>): Record<K, V> {
  return Array.from(entries).reduce((acc, [key, val]) => {
    acc[key] = val;
    return acc;
  }, {} as Record<K, V>);
}
