import type Model from '@lib/definitions';

import { Model as SequelizeModel } from 'sequelize';
import { GraphQLInt, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { GraphlQLDate } from '@lib/graphql';
import { mapRecord, filterRecord } from '@lib/utils/object';
import { unthunk } from '@lib/utils/thunk';

export function genModelGraphQLType<M extends SequelizeModel>(model: Model<M>) {
  const { definition } = model;
  const {
    name,
    description,
    fields: fieldsThunk,
    customFields: customFieldsThunk,
    timestamps,
    paranoid,
  } = definition;
  const fields = unthunk(fieldsThunk);
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
  Object.assign(gqlFields, {
    id: { type: new GraphQLNonNull(GraphQLInt) },
  });
  const customFields = unthunk(customFieldsThunk);
  if (customFields !== undefined)
    Object.assign(gqlFields, unthunk(customFields));
  if (timestamps)
    Object.assign(gqlFields, {
      createdAt: { type: new GraphQLNonNull(GraphlQLDate) },
      updatedAt: { type: new GraphQLNonNull(GraphlQLDate) },
    });
  if (paranoid === true)
    Object.assign(gqlFields, {
      deletedAt: { type: GraphlQLDate },
    });
  return new GraphQLObjectType({
    name,
    description,
    fields: gqlFields,
  });
}
