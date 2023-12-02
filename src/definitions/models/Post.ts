import {
  Model as SequelizeModel,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';

import Model, { STRING } from '@lib/definitions';
import sequelize from '@core/sequelize.js';

export interface PostModel extends SequelizeModel<InferAttributes<PostModel>, InferCreationAttributes<PostModel>> {
  id: CreationOptional<number>;
  title: string;
}
const Post = new Model<PostModel>({
  name: 'Post',
  fields: {
    title: { type: STRING, allowNull: false, exposed: true },
  },
  associations: () => ({
    user: {
      model: require('./User'),
    },
  }),
  timestamps: true,
  sequelize,
});


export default Post;
