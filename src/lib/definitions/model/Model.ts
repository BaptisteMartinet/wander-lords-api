import type { Model as SequelizeModel, Association } from 'sequelize';
import type { ModelDefinition, AssociationDefinition } from './types.js';

import { GraphQLObjectType } from 'graphql';
import { unthunk } from '@lib/utils/thunk.js';
import { genDatabaseModel, genModelGraphQLType } from './gen';

export default class Model<M extends SequelizeModel> {
  private _definition;
  private _model;
  private _type: GraphQLObjectType | null = null;
  private _associations: Map<string, [Association, AssociationDefinition]> | null = null;

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

  get associations() {
    if (this._associations !== null)
      return this._associations;
    this._associations = new Map();
    const associationDefinitions = unthunk(this._definition.associations);
    if (associationDefinitions === undefined)
      return this._associations;
    for (const [name, association] of Object.entries(associationDefinitions)) {
      if (this._associations.has(name))
        throw new Error(`Model#${this.name} has duplicated association name ${name}`);
      const { model: targetModel, type, foreignKey, deleteCascade } = association;
      const onDelete = (deleteCascade === true ? 'CASCADE' : 'SET NULL');
      switch(type) {
        case 'belongsTo':
          this._associations.set(name, [this._model.belongsTo(targetModel.model, { as: name, foreignKey, onDelete }), association]);
          break;
        case 'hasOne':
          this._associations.set(name, [this._model.hasOne(targetModel.model, { as: name, foreignKey, onDelete }), association]);
          break;
        case 'hasMany':
          this._associations.set(name, [this._model.hasMany(targetModel.model, { as: name, foreignKey, onDelete }), association]);
          break;
        default:
          throw new Error(`Invalid association type: ${type}`);
      }
    }
    return this._associations;
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
