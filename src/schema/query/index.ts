import { GraphQLObjectType } from 'graphql';
import { GraphQLNonNullList } from '@lib/graphql';
import { Author, Book } from '@definitions/models';

export default new GraphQLObjectType({
  name: 'Query',
  fields: {
    authors: {
      type: new GraphQLNonNullList(Author.type),
      resolve() {
        return Author.model.findAll();
      }
    },
    books: {
      type: new GraphQLNonNullList(Book.type),
      resolve() {
        return Book.model.findAll();
      },
    },
  },
});
