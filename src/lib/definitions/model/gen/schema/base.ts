import type { Model as SequelizeModel } from 'sequelize';
import type { GraphQLFieldConfigMap } from 'graphql';
import type { Model } from '@lib/definitions';
import type { ModelDefinition, FieldDefinition } from '@lib/definitions';

import { GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { GraphlQLDate } from '@lib/graphql';
import { mapRecord, filterRecord } from '@lib/utils/object';
import { unthunk } from '@lib/utils/thunk';
import { DefaultIDFieldDefinition } from '@lib/definitions';
import { genModelAssociationsFields } from './associations';

export function genModelColumnsFields(columns: Record<string, FieldDefinition>): GraphQLFieldConfigMap<unknown, unknown> {
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

export function genModelBaseFields(definition: Pick<ModelDefinition<never>, 'id' | 'timestamps' | 'paranoid'>): GraphQLFieldConfigMap<unknown, unknown> {
  const { id: idFieldDefinition, timestamps, paranoid } = definition;
  const idFieldType = idFieldDefinition?.type.gqlType ?? DefaultIDFieldDefinition.type.gqlType;
  return {
    id: { type: new GraphQLNonNull(idFieldType) },
    ...(timestamps ? {
      createdAt: { type: new GraphQLNonNull(GraphlQLDate) },
      updatedAt: { type: new GraphQLNonNull(GraphlQLDate) },
    } : null),
    ...(paranoid === true ? {
      deletedAt: { type: new GraphQLNonNull(GraphlQLDate) },
    } : null),
  };
}

export default function genModelGraphQLType<M extends SequelizeModel>(model: Model<M>) {
  const { definition, associations } = model;
  const {
    name,
    description,
    columns,
    fields,
  } = definition;
  return new GraphQLObjectType({
    name,
    description,
    fields: () => ({
      ...genModelBaseFields(definition),
      ...genModelColumnsFields(columns),
      ...genModelAssociationsFields(associations),
      ...(unthunk(fields)),
    }),
  });
}
