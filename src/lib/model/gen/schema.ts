import type { ModelDefinition } from '@lib/model';

import { GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { mapRecord, filterRecord } from '@lib/utils';

export function genGraphQLType(modelDefinition: ModelDefinition) {
  const { name, description, fields } = modelDefinition;
  const exposedFields = filterRecord(fields, field => field.exposed) as NonNullable<typeof fields>;
  const gqlFields = mapRecord(exposedFields, field => {
    const {
      type: { gqlType },
      defaultValue,
      description,
      allowNull,
    } = field;
    return {
      type: allowNull ? gqlType : new GraphQLNonNull(gqlType),
      description,
      defaultValue,
    };
  });
  return new GraphQLObjectType({
    name,
    description,
    fields: gqlFields,
  });
}
