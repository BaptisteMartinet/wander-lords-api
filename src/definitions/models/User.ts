import type {
  Model as SequelizeModel,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';

import Model, { INT, STRING } from '@lib/definitions';
import sequelize from '@core/sequelize.js';
import { Post } from '@definitions/models';
import { RoleEnum, Role } from '@definitions/enums';

export interface UserModel extends SequelizeModel<InferAttributes<UserModel>, InferCreationAttributes<UserModel>> {
  id: CreationOptional<number>;
  username: string;
  email: string;
  position: CreationOptional<number>;
  role: Role,
}

const User: Model<UserModel> = new Model({
  name: 'User',
  columns: {
    username: { type: STRING, allowNull: false, exposed: true  },
    email: { type: STRING, allowNull: false, exposed: true },
    position: { type: INT, allowNull: false, defaultValue: 12, exposed: false },
    role: { type: RoleEnum, allowNull: false, defaultValue: Role.Admin, exposed: true },
  },
  associations: () => ({
    posts: {
      model: Post,
    },
  }),
  customFields: () => ({
    positionGetter: {
      type: Post.type,
      resolve() {
        return null;
      },
    },
  }),
  indexes: [{ fields: ['email'], unique: true }],
  timestamps: true,
  paranoid: true,
  sequelize,
});

export default User;
