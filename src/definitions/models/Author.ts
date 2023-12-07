import type {
  Model as SequelizeModel,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';

import Model, { STRING } from '@lib/definitions';
import sequelize from '@core/sequelize.js';
import { Book } from '@definitions/models';
import { RoleEnum, Role } from '@definitions/enums';

export interface AuthorModel extends SequelizeModel<InferAttributes<AuthorModel>, InferCreationAttributes<AuthorModel>> {
  id: CreationOptional<number>;
  name: string;
  role: Role,
}

const Author: Model<AuthorModel> = new Model({
  name: 'Author',
  columns: {
    name: { type: STRING, allowNull: false, exposed: true },
    role: { type: RoleEnum, allowNull: false, defaultValue: Role.Manager, exposed: true },
  },
  associations: () => ({
    books: {
      model: Book,
      type: 'hasMany',
      exposed: true,
    },
  }),
  timestamps: true,
  sequelize,
});

export default Author;
