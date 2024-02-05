import type { CreationOptional } from 'sequelize';
import type { InferSequelizeModel } from '@sequelize-graphql/core';

import { Model, STRING } from '@sequelize-graphql/core';
import sequelize from '@core/sequelize.js';
import { Book, Profile } from '@definitions/models';
import { RoleEnum, Role } from '@definitions/enums';

export interface AuthorModel extends InferSequelizeModel<AuthorModel> {
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
      description: 'A test desc',
    },
    profile: {
      model: Profile,
      type: 'hasOne',
      foreignKey: 'authorId',
      exposed: true,
    },
  }),
  timestamps: true,
  sequelize,
});

export default Author;
