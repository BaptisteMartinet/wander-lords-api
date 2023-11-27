import type { ModelDefinition } from './types.js';

import { genGraphQLType } from './schema.js';
import { genDatabaseModel } from './database.js';

export default class Model {
  private _type;
  private _model;

  constructor(args: ModelDefinition) {
    this._type = genGraphQLType(args);
    this._model = genDatabaseModel(args);
  }

  get name() {
    return this._type.name;
  }

  /**
   * @returns The model's GraphQL type
   */
  get type() {
    return this._type;
  }

  /**
   * @returns The sequelize Model
   */
  get model() {
    return this._model;
  }
}
