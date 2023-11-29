import type { Sequelize, DataType, ModelIndexesOptions } from 'sequelize';
import type { GraphQLScalarType } from 'graphql';

export interface FieldType {
  identifier: string,
  gqlType: GraphQLScalarType,
  sequelizeType: DataType,
}

export interface FieldDefinition {
  type: FieldType,
  exposed: boolean,
  allowNull: boolean,
  defaultValue?: unknown,
  description?: string,
}

export interface ModelDefinition {
  sequelize: Sequelize,
  name: string,
  fields: Record<string, FieldDefinition>,
  timestamps: boolean,
  description?: string,
  tableName?: string,
  indexes?: readonly ModelIndexesOptions[],
}
