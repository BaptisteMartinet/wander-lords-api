import type { Model as SequelizeModel } from 'sequelize';
import type { ModelDefinition } from './types.js';

import { genDatabaseModel, genGraphQLType } from './gen';

export default class Model<ModelType extends SequelizeModel> {
  private _model;
  private _type;

  constructor(args: ModelDefinition) {
    this._model = genDatabaseModel<ModelType>(args);
    this._type = genGraphQLType(args);
  }

  get name() {
    return this._type.name;
  }

  /**
   * @returns The sequelize Model
   */
  get model() {
    return this._model;
  }

  /**
   * @returns The Model's GraphQL type
   */
  get type() {
    return this._type;
  }
}
