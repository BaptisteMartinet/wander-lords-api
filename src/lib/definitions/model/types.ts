import type {
  Sequelize,
  Model as SequelizeModel,
  DataType,
  ModelIndexesOptions,
} from 'sequelize';
import type {
  GraphQLFieldConfig,
  ThunkObjMap,
  GraphQLEnumType,
  GraphQLScalarType,
} from 'graphql';

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

export interface ModelDefinition<ModelType extends SequelizeModel> {
  name: string,
  fields: Record<string, FieldDefinition>,
  timestamps: boolean,
  sequelize: Sequelize,
  customFields?: ThunkObjMap<GraphQLFieldConfig<ModelType, unknown>>,
  description?: string,
  tableName?: string,
  indexes?: readonly ModelIndexesOptions[],
  paranoid?: boolean,
}
