import type { ModelDefinition } from '@lib/model/types';

import { mapRecord } from '@lib/utils';

export function genDatabaseModel(definition: ModelDefinition) {
  const { sequelize, name, fields, timestamps } = definition;
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
