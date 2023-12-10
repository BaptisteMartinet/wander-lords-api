import type { Model as SequelizeModel } from 'sequelize';
import type { ModelDefinition, FieldDefinition } from '@lib/definitions';

import { mapRecord } from '@lib/utils/object';

export function makeModelAttributes(fields: Record<string, FieldDefinition>) {
  const attributes = mapRecord(fields, (field) => {
    const { type, allowNull, defaultValue } = field;
    return {
      type: type.sequelizeType,
      allowNull,
      defaultValue,
    };
  })
  return attributes;
}

export function genDatabaseModel<M extends SequelizeModel>(definition: ModelDefinition<M>) {
  const {
    sequelize,
    name,
    columns,
    timestamps,
    tableName,
    indexes,
    paranoid,
  } = definition;
  const attributes = makeModelAttributes(columns);
  const model = sequelize.define<M>(name, attributes as never, {
    tableName,
    timestamps,
    indexes,
    paranoid,
    freezeTableName: true,
  });
  return model;
}
