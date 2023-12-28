import { Sequelize } from 'sequelize';
import { DATABASE_URL, DISABLE_LOGGING } from './env.js';

const sequelize = new Sequelize(DATABASE_URL, {
  logging: DISABLE_LOGGING !== true ? console.log : false,
});

export default sequelize;
