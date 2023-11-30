import type { FieldType } from './types';

import {
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
} from 'graphql';
import { DataTypes } from 'sequelize';

export const INT: FieldType = {
  identifier: 'INT',
  gqlType: GraphQLInt,
  sequelizeType: DataTypes.INTEGER,
} as const;

export const STRING: FieldType = {
  identifier: 'STRING',
  gqlType: GraphQLString,
  sequelizeType: DataTypes.STRING,
} as const;

export const BOOLEAN: FieldType = {
  identifier: 'BOOLEAN',
  gqlType: GraphQLBoolean,
  sequelizeType: DataTypes.BOOLEAN,
} as const;
