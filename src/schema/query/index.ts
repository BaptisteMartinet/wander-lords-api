import { GraphQLObjectType } from 'graphql';
import { User } from '../../definitions/models/index.js';

export default new GraphQLObjectType({
  name: 'Query',
  fields: {
    test: {
      type: User.type,
      resolve() {
        return null;
      }
    },
  },
});
