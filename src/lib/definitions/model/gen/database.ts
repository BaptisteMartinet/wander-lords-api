import type { Model as SequelizeModel, ModelStatic } from 'sequelize';
import type { ModelDefinition, AssociationDefinition, FieldDefinition } from '@lib/definitions';

import { mapRecord } from '@lib/utils';

export function makeModelAttributes(fields: Record<string, FieldDefinition>){
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

export function genModelAssociations<M extends SequelizeModel>(
  model: ModelStatic<M>,
  associations: AssociationDefinition,
) {
  console.log(associations); // TODO gen model associations
}

export function genDatabaseModel<M extends SequelizeModel>(definition: ModelDefinition<M>) {
  const {
    sequelize,
    name,
    fields,
    timestamps,
    associations,
    tableName,
    indexes,
    paranoid,
  } = definition;
  const attributes = makeModelAttributes(fields);
  const model = sequelize.define<M>(name, attributes as never, {
    tableName,
    timestamps,
    indexes,
    paranoid,
    freezeTableName: true,
  });
  if (associations !== undefined)
    genModelAssociations(model, associations());
  return model;
}
