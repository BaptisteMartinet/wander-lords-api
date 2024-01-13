/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Model as SequelizeModel, Association, WhereOptions } from 'sequelize';
import type { GraphQLFieldConfig, GraphQLFieldConfigMap } from 'graphql';
import type { AssocationSpecs } from '@lib/definitions';
import type { Context } from '@lib/schema';

import { makeRecordFromEntries, mapRecord } from '@lib/utils/object';
import { genModelOffsetPagination } from '@lib/schema';

function genAssociationWhere(
  args: {
    parent: SequelizeModel,
    sequelizeAssociation: Association,
  }
): WhereOptions {
  const { parent, sequelizeAssociation } = args;
  const { associationType, foreignKey, source, target } = sequelizeAssociation;
  switch (associationType) {
    case 'HasMany':
    case 'HasOne':
      return { [foreignKey]: parent.dataValues[source.primaryKeyAttribute] };
    case 'BelongsTo':
      return { [target.primaryKeyAttribute]: parent.dataValues[foreignKey] };
    default: throw new Error(`Unsupported association type: ${associationType}`);
  }
}

function genBelongsTo(associationSpecs: AssocationSpecs): GraphQLFieldConfig<any, Context> {
  const { sequelizeAssociation, associationDef } = associationSpecs;
  const { model: targetModel, description } = associationDef;
  return {
    type: targetModel.type,
    description,
    resolve(source, args, ctx) {
      const { foreignKey } = sequelizeAssociation;
      const pk = source[foreignKey];
      if (pk === null || pk === undefined)
        return null;
      return targetModel.findByPkAllAttrs(pk, { ctx });
    },
  };
}

function genHasOne(associationSpecs: AssocationSpecs): GraphQLFieldConfig<any, Context> {
  const { sequelizeAssociation, associationDef } = associationSpecs;
  const { model: targetModel, description } = associationDef;
  return {
    type: targetModel.type,
    description,
    resolve(parent) {
      const where = genAssociationWhere({ parent, sequelizeAssociation });
      return targetModel.model.findOne({ where });
    }
  };
}

function genHasMany(associationSpecs: AssocationSpecs): GraphQLFieldConfig<any, Context> {
  const { sequelizeAssociation, associationDef } = associationSpecs;
  const { model: targetModel, description } = associationDef;
  return genModelOffsetPagination(targetModel, {
    description,
    where(parent) {
      const where = genAssociationWhere({ parent, sequelizeAssociation });
      return where;
    },
  });
}

export function genModelAssociationsFields(associations: Map<string, AssocationSpecs>): GraphQLFieldConfigMap<unknown, Context> {
  if (associations.size <= 0)
    return {};
  const exposedAssociations = Array.from(associations).filter(([, { associationDef }]) => associationDef.exposed);
  const exposedAssociationsObj = makeRecordFromEntries(exposedAssociations);
  return mapRecord(exposedAssociationsObj, (associationSpecs) => {
    const { associationDef } = associationSpecs;
    switch (associationDef.type) {
      case 'belongsTo': return genBelongsTo(associationSpecs);
      case 'hasOne': return genHasOne(associationSpecs);
      case 'hasMany': return genHasMany(associationSpecs);
    }
  });
}
