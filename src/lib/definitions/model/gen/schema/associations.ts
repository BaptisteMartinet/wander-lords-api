/* eslint-disable @typescript-eslint/no-explicit-any */
import type { GraphQLFieldConfig, GraphQLFieldConfigMap } from 'graphql';
import type { AssocationSpecs } from '@lib/definitions';

import { GraphQLNonNullList } from '@lib/graphql';

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

export function genModelAssociationsFields(associations: Map<string, AssocationSpecs>) {
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
