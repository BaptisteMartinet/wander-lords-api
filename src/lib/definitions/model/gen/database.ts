import type { Model as SequelizeModel } from 'sequelize';
import type { ModelDefinition } from '@lib/definitions';

import { mapRecord, unthunk } from '@lib/utils';

export function genDatabaseModel<M extends SequelizeModel>(definition: ModelDefinition<M>) {
  const {
    sequelize,
    name,
    fields: fieldsThunk,
    timestamps,
    tableName,
    indexes,
    paranoid,
  } = definition;
  const fields = unthunk(fieldsThunk);
  const attributes = mapRecord(fields, (field) => {
    const { type, allowNull, defaultValue } = field;
    return {
      type: type.sequelizeType,
      allowNull,
      defaultValue,
    };
  })
  return sequelize.define<M>(name, attributes as never, {
    tableName,
    timestamps,
    indexes,
    paranoid,
    freezeTableName: true,
  });
}
