import { GraphQLObjectType } from 'graphql';
import { GraphQLNonNullList, exposeModel } from '@sequelize-graphql/core';
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
      findById: 'book',
      findByIds: 'booksByIds',
      pagination: 'books',
    }),
  },
});
