import type { GraphQLFieldConfigMap } from 'graphql';
import type Model from '@lib/definitions';
import type { FieldDefinition } from '@lib/definitions';

import { Model as SequelizeModel } from 'sequelize';
import { GraphQLInt, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { GraphlQLDate } from '@lib/graphql';
import { mapRecord, filterRecord } from '@lib/utils/object';
import { unthunk } from '@lib/utils/thunk';

function genModelColumnsFields(columns: Record<string, FieldDefinition>): GraphQLFieldConfigMap<unknown, unknown> {
  const exposedColumns = filterRecord(columns, column => column.exposed) as NonNullable<typeof columns>;
  return mapRecord(exposedColumns, field => {
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
}

function genModelBaseFields(
  args: {
    timestamps: boolean,
    paranoid?: boolean,
  },
): GraphQLFieldConfigMap<unknown, unknown> {
  const { timestamps, paranoid } = args;
  return {
    id: { type: new GraphQLNonNull(GraphQLInt) },
    ...(timestamps ? {
      createdAt: { type: new GraphQLNonNull(GraphlQLDate) },
      updatedAt: { type: new GraphQLNonNull(GraphlQLDate) },
    } : null),
    ...(paranoid === true ? {
      deletedAt: { type: new GraphQLNonNull(GraphlQLDate) },
    } : null),
  };
}

export function genModelGraphQLType<M extends SequelizeModel>(model: Model<M>) {
  const { definition } = model;
  const {
    name,
    description,
    columns,
    fields,
  } = definition;
  return new GraphQLObjectType({
    name,
    description,
    fields: {
      ...genModelBaseFields(definition),
      ...genModelColumnsFields(columns),
      ...(fields !== undefined ? unthunk(fields): null),
    },
  });
}
