import type { CreationOptional } from 'sequelize';
import type { InferModel } from '@lib/sequelize';

import { Model, STRING } from '@lib/definitions';
import sequelize from '@core/sequelize.js';
import { Book, Profile } from '@definitions/models';
import { RoleEnum, Role } from '@definitions/enums';

export interface AuthorModel extends InferModel<AuthorModel> {
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
