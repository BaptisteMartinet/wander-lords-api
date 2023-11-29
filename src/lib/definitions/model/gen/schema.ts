import type { ModelDefinition } from '@lib/definitions';

import { GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { GraphlQLDate } from '@lib/graphql';
import { mapRecord, filterRecord, unthunk } from '@lib/utils';

export function genGraphQLType(modelDefinition: ModelDefinition<never>) {
  const { name, description, fields, timestamps, customFields } = modelDefinition;
  const exposedFields = filterRecord(fields, field => field.exposed) as NonNullable<typeof fields>;
  const gqlFields = mapRecord(exposedFields, field => {
    const {
      type: { gqlType },
      defaultValue,
      description,
      allowNull,
    } = field;
    const type = allowNull ? gqlType : new GraphQLNonNull(gqlType);
    return {
      type,
      description,
      defaultValue,
    };
  });
  if (customFields)
    Object.assign(gqlFields, unthunk(customFields));
  if (timestamps)
    Object.assign(gqlFields, {
      createdAt: { type: new GraphQLNonNull(GraphlQLDate) },
      updatedAt: { type: new GraphQLNonNull(GraphlQLDate) },
    });
  return new GraphQLObjectType({
    name,
    description,
    fields: gqlFields,
  });
}