import type { Model as SequelizeModel, ModelAttributes, ModelAttributeColumnOptions } from 'sequelize';
import type { ModelDefinition, FieldDefinition, IDFieldDefinition } from '@lib/definitions';

import { DataTypes } from 'sequelize';
import { mapRecord } from '@lib/utils/object';
import { ID } from '@lib/definitions';

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

export function makeModelIdAttribute(idFieldDefinition?: IDFieldDefinition): ModelAttributeColumnOptions<never> {
  const fieldDef = idFieldDefinition !== undefined ? idFieldDefinition : { type: ID, defaultValue: DataTypes.UUIDV4 };
  const { type: { sequelizeType }, defaultValue, autoIncrement } = fieldDef;
  return { primaryKey: true, allowNull: false, type: sequelizeType, defaultValue, autoIncrement };
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
  const model = sequelize.define<M>(name, attributes as never, { // TODO camelize name
    tableName,
    timestamps,
    indexes,
    paranoid,
    freezeTableName: true,
  });
  return model;
}
