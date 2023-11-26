import type { Sequelize, DataType } from 'sequelize';

import { GraphQLInt, GraphQLScalarType, GraphQLString } from 'graphql';
import { DataTypes } from 'sequelize';

export interface FieldTypeBase {
  identifier: string,
  gqlType: GraphQLScalarType,
  sequelizeType: DataType,
}

export interface FieldDefinition {
  type: FieldTypeBase,
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
}

// TODO move somewhere else

export const Int: FieldTypeBase = {
  identifier: 'Int',
  gqlType: GraphQLInt,
  sequelizeType: DataTypes.INTEGER,
};

export const String: FieldTypeBase = {
  identifier: 'String',
  gqlType: GraphQLString,
  sequelizeType: DataTypes.STRING,
};
