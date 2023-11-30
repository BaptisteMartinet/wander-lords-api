import type { EnumType } from '@lib/utils';
import type { FieldType } from './types';

import {
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
  GraphQLEnumType,
} from 'graphql';
import { DataTypes } from 'sequelize';
import { getEnumEntries, mapRecord } from '@lib/utils';

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

export function makeEnum(
  args: {
    name: string,
    values: EnumType,
    description?: string,
  },
): FieldType {
  const { name, values, description } = args;
  const entries = getEnumEntries(values);
  const gqlType = new GraphQLEnumType({
    name,
    description,
    values: mapRecord(entries, value => ({ value })),
  });
  const entriesValues = Object.values(entries).map(String);
  const sequelizeType = DataTypes.ENUM(...entriesValues);
  return {
    identifier: 'ENUM',
    gqlType,
    sequelizeType,
  };
}
