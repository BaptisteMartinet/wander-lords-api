import type { ModelDefinition } from './types.js';

import sequelize from '../../core/sequelize.js';
import { mapRecord } from '../index.js';

export function genDatabaseModel(definition: ModelDefinition) {
  const { name, fields, timestamps } = definition;
  return sequelize.define(name, mapRecord(fields, (field) => {
    const { type, allowNull, defaultValue } = field;
    return {
      type: type.sequelizeType,
      allowNull,
      defaultValue,
    };
  }), {
    timestamps,
    freezeTableName: true,
  });
}
