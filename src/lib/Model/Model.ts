import type { ModelDefinition } from './types.js';

import { GraphQLObjectType } from 'graphql';
import { mapRecord, filterRecord } from '../index.js';

export default class Model {
  private _type;

  constructor(args: ModelDefinition) {
    this._type = Model.genGraphQLType(args);
  }

  get name() {
    return this._type.name;
  }

  private static genGraphQLType(args: ModelDefinition) {
    const { name, description, fields } = args;
    const exposedFields = filterRecord(fields, definition => definition.exposed);
    return new GraphQLObjectType({
      name,
      description,
      fields: mapRecord(exposedFields, definition => {
        const {
          type,
          defaultValue,
          description,
        } = definition;

        return {
          type: type.gqlType,
          description,
          defaultValue,
        };
      }),
    });
  }
}
