import Model, { Int, String } from '../../lib/Model/index.js';
import sequelize from '../../core/sequelize.js';

export default new Model({
  name: 'User',
  fields: {
    testInt: { type: Int, allowNull: true, exposed: true },
    testString: { type: String, allowNull: false, exposed: true, description: 'coucou'},
    testUnexposed: { type: Int, allowNull: false, exposed: false },
  },
  timestamps: true,
  sequelize,
});
