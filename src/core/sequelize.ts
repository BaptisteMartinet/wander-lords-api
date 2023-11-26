import { Sequelize } from 'sequelize';
import { DATABASE_URL } from './env.js';

const sequelize = new Sequelize(DATABASE_URL);

export default sequelize;
