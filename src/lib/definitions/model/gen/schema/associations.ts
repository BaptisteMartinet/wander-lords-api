/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Model as SequelizeModel, Association, WhereOptions } from 'sequelize';
import type { GraphQLFieldConfig, GraphQLFieldConfigMap } from 'graphql';
import type { AssocationSpecs } from '@lib/definitions';

import { makeRecordFromEntries, mapRecord } from '@lib/utils/object';
import { genModelOffsetPagination } from '@lib/schema';

function genAssociationWhere(
  args: {
    source: SequelizeModel,
    sequelizeAssociation: Association,
  }
): WhereOptions {
  const { source, sequelizeAssociation } = args;
  const { foreignKey, isMultiAssociation } = sequelizeAssociation;
  // TODO The Association type does not include targetKey/sourceKey
  const sourceKey: string = (sequelizeAssociation as any).targetKey ?? (sequelizeAssociation as any).sourceKey;
  if (isMultiAssociation)
    return { [foreignKey]: source.dataValues[sourceKey] };
  return { [sourceKey]: source.dataValues[foreignKey] };
}

function genBelongsTo(associationSpecs: AssocationSpecs): GraphQLFieldConfig<any, unknown> {
  const { sequelizeAssociation, associationDef } = associationSpecs;
  const { model: targetModel, description } = associationDef;
  return {
    type: targetModel.type,
    description,
    resolve(source) {
      const where = genAssociationWhere({ source, sequelizeAssociation });
      return targetModel.model.findOne({ where });
    },
  };
}

function genHasOne(associationSpecs: AssocationSpecs): GraphQLFieldConfig<any, unknown> {
  const { sequelizeAssociation, associationDef } = associationSpecs;
  const { model: targetModel, description } = associationDef;
  return {
    type: targetModel.type,
    description,
    resolve(source) {
      const where = genAssociationWhere({ source, sequelizeAssociation });
      return targetModel.model.findOne({ where });
    }
  };
}

function genHasMany(associationSpecs: AssocationSpecs): GraphQLFieldConfig<any, unknown> {
  const { sequelizeAssociation, associationDef } = associationSpecs;
  const { model: targetModel, description } = associationDef;
  return genModelOffsetPagination(targetModel, {
    description,
    where(source) {
      const where = genAssociationWhere({ source, sequelizeAssociation });
      return where;
    },
  });
}

export function genModelAssociationsFields(associations: Map<string, AssocationSpecs>): GraphQLFieldConfigMap<unknown, unknown> {
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
