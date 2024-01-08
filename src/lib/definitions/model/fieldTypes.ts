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

/**
 * To be used with a `UUIDV1` or `UUIDV4` default value.
 */
export const ID = {
  gqlType: GraphQLID,
  sequelizeType: DataTypes.UUID,
} as const satisfies FieldType;

export const INTEGER = {
  gqlType: GraphQLInt,
  sequelizeType: DataTypes.INTEGER,
} as const satisfies FieldType;

export const FLOAT = {
  gqlType: GraphQLFloat,
  sequelizeType: DataTypes.FLOAT,
} as const satisfies FieldType;

export const STRING = {
  gqlType: GraphQLString,
  sequelizeType: DataTypes.STRING,
} as const satisfies FieldType;

export const BOOLEAN = {
  gqlType: GraphQLBoolean,
  sequelizeType: DataTypes.BOOLEAN,
} as const satisfies FieldType;

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
