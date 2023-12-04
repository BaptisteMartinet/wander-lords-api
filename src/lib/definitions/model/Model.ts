import type { Model as SequelizeModel } from 'sequelize';
import type { ModelDefinition } from './types.js';

import { GraphQLObjectType } from 'graphql';
import { genDatabaseModel, genModelGraphQLType } from './gen';

export default class Model<M extends SequelizeModel> {
  private _definition;
  private _model;
  private _type: GraphQLObjectType | null = null;

  constructor(definition: ModelDefinition<M>) {
    this._definition = definition;
    this._model = genDatabaseModel(definition);
  }

  get definition() {
    return this._definition;
  }

  get name() {
    return this.definition.name;
  }

  /**
   * @returns The Model's GraphQL type
   */
  get type() {
    if (!this._type)
      this._type = genModelGraphQLType(this);
    return this._type;
  }

  /**
   * @returns The sequelize Model
   */
  get model() {
    return this._model;
  }
}
