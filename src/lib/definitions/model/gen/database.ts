import type { Model as SequelizeModel, ModelAttributes, ModelAttributeColumnOptions } from 'sequelize';
import type { ModelDefinition, FieldDefinition, IDFieldDefinition } from '@lib/definitions';

import { mapRecord } from '@lib/utils/object';
import { camelize } from '@lib/utils/string';
import { DefaultIDFieldDefinition } from '@lib/definitions';

export function makeModelAttributes(fields: Record<string, FieldDefinition>): ModelAttributes {
  const attributes = mapRecord(fields, (field) => {
    const { type, allowNull, defaultValue, autoIncrement } = field;
    return {
      type: type.sequelizeType,
      allowNull,
      defaultValue,
      autoIncrement,
    };
  })
  return attributes;
}

export function makeModelIdAttribute(idFieldDefinition: IDFieldDefinition = DefaultIDFieldDefinition): ModelAttributeColumnOptions<never> {
  const { type: { sequelizeType: type }, defaultValue, autoIncrement } = idFieldDefinition;
  return { primaryKey: true, allowNull: false, type, defaultValue, autoIncrement };
}

export function genDatabaseModel<M extends SequelizeModel>(definition: ModelDefinition<M>) {
  const {
    sequelize,
    name,
    id: idFieldDefinition,
    columns,
    timestamps,
    tableName,
    indexes,
    paranoid,
  } = definition;
  const attributes: ModelAttributes<M> = {
    id: makeModelIdAttribute(idFieldDefinition),
    ...makeModelAttributes(columns),
  };
  const model = sequelize.define<M>(camelize(name), attributes as never, {
    tableName,
    timestamps,
    indexes,
    paranoid,
    freezeTableName: true,
  });
  return model;
}
