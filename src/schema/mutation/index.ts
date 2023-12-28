import { GraphQLNonNull, GraphQLObjectType } from 'graphql';
import AuthorMutation from './Author';
import BookMutation from './Book';

export default new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    author: { type: new GraphQLNonNull(AuthorMutation), resolve: () => ({}) },
    book: { type: new GraphQLNonNull(BookMutation), resolve: () => ({}) },
  },
});
