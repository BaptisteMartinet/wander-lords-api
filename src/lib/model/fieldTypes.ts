import type { FieldType } from './types';

import {
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
} from 'graphql';
import { DataTypes } from 'sequelize';

export const Int: FieldType = {
  identifier: 'Int',
  gqlType: GraphQLInt,
  sequelizeType: DataTypes.INTEGER,
} as const;

export const String: FieldType = {
  identifier: 'String',
  gqlType: GraphQLString,
  sequelizeType: DataTypes.STRING,
} as const;

export const Boolean: FieldType = {
  identifier: 'Boolean',
  gqlType: GraphQLBoolean,
  sequelizeType: DataTypes.BOOLEAN,
} as const;
