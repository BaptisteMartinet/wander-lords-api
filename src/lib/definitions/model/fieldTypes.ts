import type { EnumType } from '@lib/utils/enum';
import type { FieldType } from './types';

import {
  GraphQLID,
  GraphQLInt,
  GraphQLFloat,
  GraphQLString,
  GraphQLBoolean,
  GraphQLEnumType,
} from 'graphql';
import { DataTypes } from 'sequelize';
import { mapRecord } from '@lib/utils/object';
import { getEnumEntries } from '@lib/utils/enum';

export const ID: FieldType = {
  gqlType: GraphQLID,
  sequelizeType: DataTypes.UUID,
} as const;

export const INTEGER: FieldType = {
  gqlType: GraphQLInt,
  sequelizeType: DataTypes.INTEGER,
} as const;

export const FLOAT: FieldType = {
  gqlType: GraphQLFloat,
  sequelizeType: DataTypes.FLOAT,
} as const;

export const STRING: FieldType = {
  gqlType: GraphQLString,
  sequelizeType: DataTypes.STRING,
} as const;

export const BOOLEAN: FieldType = {
  gqlType: GraphQLBoolean,
  sequelizeType: DataTypes.BOOLEAN,
} as const;

/**
 * Takes an enum and build its FieldType
 *
 * @example
 *
 * ```ts
 * enum Role {
 *  Manager = 'Manager',
 *  Admin = 'Admin',
 * }
 * const RoleEnum = makeEnum({
 *  name: 'Role',
 *  values: Role,
 * });
 * console.log(RoleEnum.gqlType, RoleEnum.sequelizeType);
 *
 * const User = new Model({
 *  fields: {
 *    role: { type: RoleEnum, allowNull: false, defaultValue: Role.Manager, exposed: true },
 *  },
 *  ...
 * });
 * ```
 */
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
    gqlType,
    sequelizeType,
  };
}
