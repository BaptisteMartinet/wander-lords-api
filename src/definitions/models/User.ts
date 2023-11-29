import type {
  Model as SequelizeModel,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';

import { GraphQLInt, GraphQLNonNull } from 'graphql';
import Model, { Int, String } from '@lib/definitions';
import sequelize from '@core/sequelize.js';

export interface UserModel extends SequelizeModel<InferAttributes<UserModel>, InferCreationAttributes<UserModel>> {
  id: CreationOptional<number>;
  username: string;
  email: string;
  position: CreationOptional<number>;
}

const User = new Model<UserModel>({
  name: 'User',
  fields: {
    username: { type: String, allowNull: false, exposed: true  },
    email: { type: String, allowNull: false, exposed: true },
    position: { type: Int, allowNull: false, defaultValue: 12, exposed: false },
  },
  customFields: () => ({
    positionGetter: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve(source) {
        return source.position;
      },
    },
  }),
  indexes: [{ fields: ['email'], unique: true }],
  timestamps: true,
  sequelize,
});

export default User;
