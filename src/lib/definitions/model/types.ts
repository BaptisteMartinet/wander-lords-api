/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ThunkObj } from '@lib/utils/thunk';

import type {
  Sequelize,
  Model as SequelizeModel,
  DataType,
  ModelIndexesOptions,
  Association,
} from 'sequelize';
import type {
  GraphQLFieldConfig,
  GraphQLEnumType,
  GraphQLScalarType,
} from 'graphql';
import type Model from './Model';

export interface FieldType {
  gqlType: GraphQLScalarType | GraphQLEnumType, // TODO infer typing?
  sequelizeType: DataType,
}

export interface FieldDefinition {
  type: FieldType,
  allowNull: boolean,
  exposed: boolean,
  defaultValue?: unknown,
  autoIncrement?: boolean,
  orderable?: boolean,
  description?: string,
}

export type IDFieldDefinition = Pick<FieldDefinition, 'type' | 'autoIncrement' | 'defaultValue'>;

export type AssociationType = 'belongsTo' | 'hasOne' | 'hasMany';

export interface AssociationDefinition {
  model: Model<any>,
  type: AssociationType,
  exposed: boolean,
  foreignKey?: string,
  sourceKey?: string,
  deleteCascade?: boolean,
  description?: string,
}

export type AssocationSpecs = {
  sequelizeAssociation: Association,
  associationDef: AssociationDefinition,
};

export interface ModelDefinition<ModelType extends SequelizeModel> {
  name: string,
  id?: IDFieldDefinition,
  columns: Record<string, FieldDefinition>,
  timestamps: boolean,
  sequelize: Sequelize,
  associations?: () => Record<string, AssociationDefinition>,
  fields?: ThunkObj<GraphQLFieldConfig<ModelType, unknown>>,
  description?: string,
  tableName?: string,
  indexes?: readonly ModelIndexesOptions[],
  paranoid?: boolean,
}
