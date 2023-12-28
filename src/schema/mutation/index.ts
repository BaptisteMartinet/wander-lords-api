import { GraphQLBoolean, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { Author, Book } from '@definitions/models';
import { RoleEnum } from '@definitions/enums';

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

    createBook: {
      type: new GraphQLNonNull(Book.type),
      args: {
        authorId: { type: new GraphQLNonNull(GraphQLInt) },
        title: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(_, args) {
        const { authorId, title } = args;
        return Book.model.create({ title, authorId });
      },
    },

    deleteBook: {
      type: new GraphQLNonNull(GraphQLBoolean),
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
      },
      async resolve(_, args) {
        const { id } = args;
        await Book.ensureExistence(id);
        await Book.model.destroy({ where: { id } });
        return true;
      },
    },
  },
});
