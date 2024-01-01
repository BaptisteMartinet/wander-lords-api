import { GraphQLObjectType } from 'graphql';
import { scopedMutation } from '@lib/schema';
import AuthorMutation from './Author.mutation';
import BookMutation from './Book.mutation';

export default new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    author: scopedMutation(AuthorMutation),
    book: scopedMutation(BookMutation),
  },
});
