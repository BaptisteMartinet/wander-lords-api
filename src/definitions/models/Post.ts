import {
  Model as SequelizeModel,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';

import Model, { STRING } from '@lib/definitions';
import sequelize from '@core/sequelize.js';
import { User } from '@definitions/models';

export interface PostModel extends SequelizeModel<InferAttributes<PostModel>, InferCreationAttributes<PostModel>> {
  id: CreationOptional<number>;
  title: string;
}

const Post: Model<PostModel> = new Model<PostModel>({
  name: 'Post',
  columns: {
    title: { type: STRING, allowNull: false, exposed: true },
  },
  associations: () => ({
    user: {
      model: User,
    },
  }),
  timestamps: true,
  sequelize,
});


export default Post;
