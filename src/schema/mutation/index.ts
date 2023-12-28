import { GraphQLObjectType } from 'graphql';
import AuthorMutation from './Author';
import BookMutation from './Book';

export default new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    author: { type: AuthorMutation, resolve: () => ({}) },
    book: { type: BookMutation, resolve: () => ({}) },
  },
});
