import {
  Model as SequelizeModel,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
} from 'sequelize';

import Model, { STRING, INTEGER } from '@lib/definitions';
import sequelize from '@core/sequelize.js';
import { Author } from '@definitions/models';

export interface BookModel extends SequelizeModel<InferAttributes<BookModel>, InferCreationAttributes<BookModel>> {
  id: CreationOptional<number>;
  authorId: ForeignKey<number>;
  title: string;
}

const Book: Model<BookModel> = new Model({
  name: 'Book',
  columns: {
    authorId: { type: INTEGER, allowNull: false, exposed: true },
    title: { type: STRING, allowNull: false, exposed: true },
  },
  associations: () => ({
    author: {
      model: Author,
      type: 'belongsTo',
      exposed: true,
    },
  }),
  timestamps: true,
  sequelize,
});


export default Book;
