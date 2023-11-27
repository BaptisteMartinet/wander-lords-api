import type {
  Model as SequelizeModel,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';

import Model, { Int, String, Boolean } from '@lib/model';
import sequelize from '@core/sequelize.js';

export interface UserInstance extends SequelizeModel<InferAttributes<UserInstance>, InferCreationAttributes<UserInstance>> {
  id: CreationOptional<number>;
  testInt: number;
  testString: string;
  testUnexposed: number;
  testBool: boolean;
}

const User = new Model<UserInstance>({
  name: 'User',
  fields: {
    testInt: { type: Int, allowNull: true, exposed: true },
    testString: { type: String, allowNull: false, exposed: true, description: 'coucou' },
    testUnexposed: { type: Int, allowNull: false, exposed: false },
    testBool: { type: Boolean, allowNull: false, defaultValue: 12, exposed: true },
  },
  timestamps: true,
  sequelize,
});

export default User;
