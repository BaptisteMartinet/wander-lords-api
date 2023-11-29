export function mapRecord<KeyType extends string, ValueType, OutputType>(obj: Record<KeyType, ValueType>, fn: (value: ValueType) => OutputType) {
  const newObj = {} as Record<KeyType, OutputType>;
  for (const key in obj) {
    const value = obj[key];
    newObj[key] = fn(value);
  }
  return newObj;
}

export function filterRecord<KeyType extends string, ValueType, ObjectType extends Record<KeyType, ValueType>>(obj: ObjectType, fn: (value: ValueType) => boolean) {
  const newObj: Partial<ObjectType> = {};
  for (const key in obj) {
    const value = obj[key];
    if (fn(value))
      newObj[key] = value;
  }
  return newObj;
}
