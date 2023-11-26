import { Sequelize } from 'sequelize';
import { DATABASE_URL } from './env.js';

console.log(DATABASE_URL);

const sequelize = new Sequelize(DATABASE_URL);

export default sequelize;
