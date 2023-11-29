import { GraphQLObjectType } from 'graphql';
import { GraphQLNonNullList } from '@lib/graphql';
import { User } from '@definitions/models';

export default new GraphQLObjectType({
  name: 'Query',
  fields: {
    users: {
      type: new GraphQLNonNullList(User.type),
      resolve() {
        return User.model.findAll();
      }
    },
  },
});
