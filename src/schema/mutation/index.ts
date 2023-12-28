import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { Author } from '@definitions/models';
import { RoleEnum } from '@definitions/enums';
import BookMutation from './Book';

export default new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createAuthor: {
      type: new GraphQLNonNull(Author.type),
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        role: { type: RoleEnum.gqlType }
      },
      resolve(_, args) {
        const { name, role } = args;
        return Author.model.create({ name, role });
      },
    },

    book: { type: BookMutation, resolve: () => ({}) }, // TODO find a better way to handle scoped mutations
  },
});
