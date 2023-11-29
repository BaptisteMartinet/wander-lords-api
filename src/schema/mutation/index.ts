import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { User } from '@definitions/models';

export default new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createUser: {
      type: new GraphQLNonNull(User.type),
      args: {
        username: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(_, args) {
        return User.model.create(args);
      },
    },
  },
});
