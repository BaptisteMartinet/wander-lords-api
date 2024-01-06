import type { GraphQLNamedType } from 'graphql';

const GraphQLTypesMap = new Map<string, GraphQLNamedType>();

/**
 * @description Looks if provided type has already been created. Cache it otherwise.
 */
export default function cacheGQLType<T extends GraphQLNamedType>(type: T) {
  const typeName = type.name;
  const cachedType = GraphQLTypesMap.get(typeName);
  if (cachedType !== undefined)
    return cachedType as T;
  GraphQLTypesMap.set(typeName, type);
  return type;
}
