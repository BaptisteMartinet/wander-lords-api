/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Model as SequelizeModel, Association } from 'sequelize';
import type { GraphQLFieldConfig, GraphQLFieldConfigMap } from 'graphql';
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

export function genBelongsTo(args: { sequelizeAssociation: Association, associationDef: AssociationDefinition }): GraphQLFieldConfig<any, unknown> {
  const { sequelizeAssociation, associationDef } = args;
  const { model: targetModel } = associationDef;
  return {
    type: targetModel.type,
    resolve(source) {
      const targetModelPk = source[sequelizeAssociation.foreignKey];
      if (targetModelPk === null || targetModelPk === undefined)
        return null;
      return targetModel.model.findByPk(targetModelPk);
    },
  };
}

export function genHasOne(args: { sequelizeAssociation: Association, associationDef: AssociationDefinition }): GraphQLFieldConfig<any, unknown> {
  const { sequelizeAssociation, associationDef } = args;
  const { model: targetModel } = associationDef;
  return {
    type: targetModel.type,
    resolve(source) {
      const targetModelPk = source[sequelizeAssociation.foreignKey];
      if (targetModelPk === null || targetModelPk === undefined)
        return null;
      return targetModel.model.findByPk(targetModelPk);
    }
  };
}

export function genHasMany(args: { sequelizeAssociation: Association, associationDef: AssociationDefinition }): GraphQLFieldConfig<any, unknown> {
  const { sequelizeAssociation, associationDef } = args;
  const { model: targetModel } = associationDef;
  return {
    type: new GraphQLNonNullList(targetModel.type),
    resolve(source) {
      const where: Record<string, unknown> = {};
      where[sequelizeAssociation.foreignKey] = source.id;
      return targetModel.model.findAll({ where });
    },
  };
}

export function genModelAssociationsFields(associations: Map<string, { sequelizeAssociation: Association, associationDef: AssociationDefinition }>) {
  if (associations.size <= 0)
    return {};
  const ret: GraphQLFieldConfigMap<any, unknown> = {};
  for (const [associationName, associationSpecs] of associations) {
    const { exposed, type } = associationSpecs.associationDef;
    if (!exposed)
      continue;
    switch(type) {
      case 'belongsTo':
        ret[associationName] = genBelongsTo(associationSpecs);
        break;
      case 'hasOne':
        ret[associationName] = genHasOne(associationSpecs);
        break;
      case 'hasMany':
        ret[associationName] = genHasMany(associationSpecs);
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
