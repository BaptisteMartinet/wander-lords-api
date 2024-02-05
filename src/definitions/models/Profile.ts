import type { CreationOptional } from 'sequelize';
import type { InferSequelizeModel } from '@sequelize-graphql/core';

import { ID, Model, STRING } from '@sequelize-graphql/core';
import sequelize from '@core/sequelize.js';
import { Author } from '@definitions/models';

export interface ProfileModel extends InferSequelizeModel<ProfileModel> {
  id: CreationOptional<string>;
  username: string;
  authorId: string;
}

const Profile: Model<ProfileModel> = new Model({
  name: 'Profile',
  columns: {
    username: { type: STRING, allowNull: false, exposed: true },
    authorId: { type: ID, allowNull: false, exposed: true },
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

export default Profile;
