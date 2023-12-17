import { GraphQLObjectType } from 'graphql';
import { GraphQLNonNullList } from '@lib/graphql';
import { exposeModel } from '@lib/schema';
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

    ...exposeModel(Book, {
      one: 'book',
      list: 'books',
    }),
  },
});
