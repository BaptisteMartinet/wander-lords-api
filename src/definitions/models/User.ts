import type {
  Model as SequelizeModel,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';

import { GraphQLInt, GraphQLNonNull } from 'graphql';
import Model, { INT, STRING } from '@lib/definitions';
import sequelize from '@core/sequelize.js';
import { RoleEnum, Role } from '@definitions/enums';

export interface UserModel extends SequelizeModel<InferAttributes<UserModel>, InferCreationAttributes<UserModel>> {
  id: CreationOptional<number>;
  username: string;
  email: string;
  position: CreationOptional<number>;
  role: Role,
}

const User = new Model<UserModel>({
  name: 'User',
  fields: {
    username: { type: STRING, allowNull: false, exposed: true  },
    email: { type: STRING, allowNull: false, exposed: true },
    position: { type: INT, allowNull: false, defaultValue: 12, exposed: false },
    role: { type: RoleEnum, allowNull: false, defaultValue: Role.Admin, exposed: true },
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
  paranoid: true,
  sequelize,
});

export default User;
