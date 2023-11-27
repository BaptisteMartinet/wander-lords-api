import Model, { Int, String, Boolean } from '@lib/model';
import sequelize from '@core/sequelize.js';

export default new Model({
  name: 'User',
  fields: {
    testInt: { type: Int, allowNull: true, exposed: true },
    testString: { type: String, allowNull: false, exposed: true, description: 'coucou'},
    testUnexposed: { type: Int, allowNull: false, exposed: false },
    testBool: { type: Boolean, allowNull: false, defaultValue: 12, exposed: true },
  },
  timestamps: true,
  sequelize,
});
