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
    columns: columnsThunk,
    fields: fieldsThunk,
    timestamps,
    paranoid,
  } = definition;
  const columns = unthunk(columnsThunk);
  const exposedColumns = filterRecord(columns, column => column.exposed) as NonNullable<typeof columns>;
  const gqlFields = mapRecord(exposedColumns, field => {
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
  const fields = unthunk(fieldsThunk);
  if (fields !== undefined)
    Object.assign(gqlFields, unthunk(fields));
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
