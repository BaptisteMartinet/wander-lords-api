import type { ModelDefinition } from '@lib/model';

import { GraphQLObjectType } from 'graphql';
import { mapRecord, filterRecord } from '@lib/utils';

export function genGraphQLType(modelDefinition: ModelDefinition) {
  const { name, description, fields } = modelDefinition;
  const exposedFields = filterRecord(fields, field => field.exposed) as NonNullable<typeof fields>;
  const gqlFields = mapRecord(exposedFields, field => {
    const {
      type,
      defaultValue,
      description,
    } = field;
    return {
      type: type.gqlType,
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
