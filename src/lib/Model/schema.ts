import type { ModelDefinition } from './types.js';

import { GraphQLObjectType } from 'graphql';
import { mapRecord, filterRecord } from '@lib/utils';

export function genGraphQLType(modelDefinition: ModelDefinition) {
  const { name, description, fields } = modelDefinition;
  const exposedFields = filterRecord(fields, field => field.exposed);
  return new GraphQLObjectType({
    name,
    description,
    fields: mapRecord(exposedFields, field => {
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
    }),
  });
}
