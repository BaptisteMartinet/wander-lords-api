import type { Model as SequelizeModel, Identifier } from 'sequelize';
import type { ModelDefinition, AssociationDefinition, AssocationSpecs } from './types.js';

import { GraphQLObjectType } from 'graphql';
import { unthunk } from '@lib/utils/thunk.js';
import { genDatabaseModel, genModelGraphQLType } from './gen';

export default class Model<M extends SequelizeModel> {
  private _definition;
  private _model;
  private _type: GraphQLObjectType | null = null;
  private _associations: Map<string, AssocationSpecs> | null = null;

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

  private genAssociation(associationName: string, associationDef: AssociationDefinition) {
    const { model: targetModel, type, foreignKey, sourceKey, deleteCascade } = associationDef;
    const onDelete = (deleteCascade === true ? 'CASCADE' : 'SET NULL');
    switch(type) {
      case 'belongsTo': return this._model.belongsTo(targetModel.model, { as: associationName, foreignKey, targetKey: sourceKey, onDelete });
      case 'hasOne': return this._model.hasOne(targetModel.model, { as: associationName, foreignKey, sourceKey, onDelete });
      case 'hasMany': return this._model.hasMany(targetModel.model, { as: associationName, foreignKey, sourceKey, onDelete });
      default: throw new Error(`Invalid association type: ${type}`);
    }
  }

  get associations() {
    if (this._associations !== null)
      return this._associations;
    this._associations = new Map();
    const associationsDefs = unthunk(this._definition.associations);
    if (associationsDefs === undefined)
      return this._associations;
    for (const [associationName, associationDef] of Object.entries(associationsDefs)) {
      if (this._associations.has(associationName))
        throw new Error(`Model#${this.name} has duplicated association name ${associationName}`);
      const sequelizeAssociation = this.genAssociation(associationName, associationDef);
      this._associations.set(associationName, { sequelizeAssociation, associationDef });
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

  public formatIdentifier(identifier: Identifier) {
    return this.name + '#' + identifier;
  }

  public async ensureExistence(identifier: Identifier) {
    const instance = await this.model.findByPk(identifier);
    if (instance === null)
      throw new Error(`EnsureExistence check failed for model ${this.formatIdentifier(identifier)}`);
    return instance;
  }

  public ensureExistenceOptional(identifier: Identifier | null) {
    if (identifier === null)
      return null;
    return this.ensureExistence(identifier);
  }
}
