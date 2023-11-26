import { GraphQLInt, GraphQLScalarType, GraphQLString } from 'graphql';

export interface FieldTypeBase {
  identifier: string,
  gqlType: GraphQLScalarType,
}

export interface FieldDefinition {
  type: FieldTypeBase,
  exposed: boolean,
  allowNull: boolean,
  defaultValue?: unknown,
  description?: string,
}

export interface ModelDefinition {
  name: string,
  fields: Record<string, FieldDefinition>,
  description?: string,
}

export const Int: FieldTypeBase = {
  identifier: 'Int',
  gqlType: GraphQLInt,
};

export const String: FieldTypeBase = {
  identifier: 'String',
  gqlType: GraphQLString,
};
