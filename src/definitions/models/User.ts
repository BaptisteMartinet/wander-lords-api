import type {
  Model as SequelizeModel,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';

import { GraphQLBoolean } from 'graphql';
import Model, { Int, String, Boolean } from '@lib/model';
import sequelize from '@core/sequelize.js';

export interface UserModel extends SequelizeModel<InferAttributes<UserModel>, InferCreationAttributes<UserModel>> {
  id: CreationOptional<number>;
  testInt: number;
  testString: string;
  testUnexposed: number;
  testBool: boolean;
  email: string;
}

const User = new Model<UserModel>({
  name: 'User',
  fields: {
    testInt: { type: Int, allowNull: true, exposed: true },
    testString: { type: String, allowNull: false, exposed: true, description: 'coucou' },
    testUnexposed: { type: Int, allowNull: false, exposed: false },
    testBool: { type: Boolean, allowNull: false, defaultValue: true, exposed: true },
    email: { type: String, allowNull: false, exposed: true },
  },
  customFields: () => ({
    testCustomField: {
      type: GraphQLBoolean,
      resolve(source) {
        return source.testBool;
      },
    },
  }),
  indexes: [{ fields: ['email'], unique: true }],
  timestamps: true,
  sequelize,
});

export default User;
