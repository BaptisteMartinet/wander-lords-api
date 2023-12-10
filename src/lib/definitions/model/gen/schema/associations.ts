/* eslint-disable @typescript-eslint/no-explicit-any */
import type { GraphQLFieldConfig, GraphQLFieldConfigMap } from 'graphql';
import type { AssocationSpecs } from '@lib/definitions';

import { GraphQLNonNullList } from '@lib/graphql';
import { makeRecordFromEntries, mapRecord } from '@lib/utils/object';

function genBelongsTo(associationSpecs: AssocationSpecs): GraphQLFieldConfig<any, unknown> {
  const { sequelizeAssociation, associationDef } = associationSpecs;
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

function genHasOne(associationSpecs: AssocationSpecs): GraphQLFieldConfig<any, unknown> {
  const { sequelizeAssociation, associationDef } = associationSpecs;
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

function genHasMany(associationSpecs: AssocationSpecs): GraphQLFieldConfig<any, unknown> {
  const { sequelizeAssociation, associationDef } = associationSpecs;
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

export function genModelAssociationsFields(associations: Map<string, AssocationSpecs>): GraphQLFieldConfigMap<unknown, unknown> {
  if (associations.size <= 0)
    return {};
  const exposedAssociations = Array.from(associations).filter(([, { associationDef }]) => associationDef.exposed);
  const exposedAssociationsObj = makeRecordFromEntries(exposedAssociations);
  return mapRecord(exposedAssociationsObj, (associationSpecs) => {
    const { associationDef } = associationSpecs;
    switch(associationDef.type) {
      case 'belongsTo': return genBelongsTo(associationSpecs);
      case 'hasOne': return genHasOne(associationSpecs);
      case 'hasMany' : return genHasMany(associationSpecs);
    }
  });
}
