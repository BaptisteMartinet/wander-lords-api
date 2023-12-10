/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ThunkObj } from '@lib/utils/thunk';

import type {
  Sequelize,
  Model as SequelizeModel,
  DataType,
  ModelIndexesOptions,
} from 'sequelize';
import type {
  GraphQLFieldConfig,
  GraphQLEnumType,
  GraphQLScalarType,
} from 'graphql';
import type Model from './Model';

export interface FieldType {
  identifier: string,
  gqlType: GraphQLScalarType | GraphQLEnumType, // TODO infer typing?
  sequelizeType: DataType,
}

export interface FieldDefinition {
  type: FieldType,
  exposed: boolean,
  allowNull: boolean,
  defaultValue?: unknown,
  description?: string,
}

export type AssociationType = 'belongsTo' | 'hasOne' | 'hasMany';

export interface AssociationDefinition {
  model: Model<any>,
  type: AssociationType,
  exposed: boolean,
  foreignKey?: string,
  sourceKey?: string,
  deleteCascade?: boolean,
}

export interface ModelDefinition<ModelType extends SequelizeModel> {
  name: string,
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
