import type { Model as SequelizeModel } from 'sequelize';
import type { ModelDefinition } from './types.js';

import { GraphQLObjectType } from 'graphql';
import { genDatabaseModel, genGraphQLType } from './gen';

export default class Model<M extends SequelizeModel> {
  private _model;
  private _type: GraphQLObjectType | null = null;

  constructor(protected definition: ModelDefinition<M>) {
    this._model = genDatabaseModel(definition);
  }

  get name() {
    return this.definition.name;
  }

  /**
   * @returns The Model's GraphQL type
   */
  get type() {
    if (!this._type)
      this._type = genGraphQLType(this.definition);
    return this._type;
  }

  /**
   * @returns The sequelize Model
   */
  get model() {
    return this._model;
  }
}
