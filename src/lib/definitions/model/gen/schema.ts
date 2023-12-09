/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Model as SequelizeModel, Association } from 'sequelize';
import type { GraphQLFieldConfigMap } from 'graphql';
import type Model from '@lib/definitions';
import type { FieldDefinition, AssociationDefinition } from '@lib/definitions';

import { GraphQLInt, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { GraphQLNonNullList, GraphlQLDate } from '@lib/graphql';
import { mapRecord, filterRecord } from '@lib/utils/object';
import { unthunk } from '@lib/utils/thunk';

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

export function genModelBaseFields(
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

export function genModelAssociationsFields(associations: Map<string, [Association, AssociationDefinition]>) {
  if (associations.size <= 0)
    return {};
  const ret: GraphQLFieldConfigMap<any, unknown> = {};
  for (const [name, association_] of associations) {
    const [association, associationDef] = association_;
    const { exposed, type, model: targetModel } = associationDef;
    if (!exposed)
      continue;
    switch(type) {
      case 'belongsTo':
        ret[name] = {
          type: targetModel.type,
          resolve(source) {
            const targetModelPk = source[association.foreignKey];
            if (targetModelPk === null || targetModelPk === undefined)
              return null;
            return targetModel.model.findByPk(targetModelPk);
          },
        };
        break;
      case 'hasOne':
        ret[name] = {
          type: targetModel.type,
          resolve(source) {
            const targetModelPk = source[association.foreignKey];
            if (targetModelPk === null || targetModelPk === undefined)
              return null;
            return targetModel.model.findByPk(targetModelPk);
          }
        };
        break;
      case 'hasMany':
        ret[name] = {
          type: new GraphQLNonNullList(targetModel.type),
          resolve(source) {
            const where: Record<string, unknown> = {};
            where[association.foreignKey] = source.id;
            return targetModel.model.findAll({ where });
          },
        };
        break;
      default: throw new Error(`Unsupported association type: ${type}`);
    }
  }
  return ret;
}

export function genModelGraphQLType<M extends SequelizeModel>(model: Model<M>) {
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
