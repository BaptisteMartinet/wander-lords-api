import { GraphQLID, GraphQLInputObjectType, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { Profile } from '@definitions/models';

export default new GraphQLObjectType({
  name: 'ProfileMutation',
  fields: {
    create: {
      type: new GraphQLNonNull(Profile.type),
      args: {
        input: {
          type: new GraphQLNonNull(new GraphQLInputObjectType({
            name: 'CreateProfileInput',
            fields: {
              username: { type: new GraphQLNonNull(GraphQLString) },
              authorId: { type: new GraphQLNonNull(GraphQLID) },
            },
          })),
        },
      },
      resolve(_, args) {
        const { input: { username, authorId } } = args;
        return Profile.model.create({ username, authorId });
      },
    },
  },
});
