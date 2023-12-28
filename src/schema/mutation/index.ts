import { GraphQLNonNull, GraphQLObjectType } from 'graphql';
import AuthorMutation from './Author.mutation';
import BookMutation from './Book.mutation';

export default new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    author: { type: new GraphQLNonNull(AuthorMutation), resolve: () => ({}) },
    book: { type: new GraphQLNonNull(BookMutation), resolve: () => ({}) },
  },
});
