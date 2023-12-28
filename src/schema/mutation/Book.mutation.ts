import { GraphQLBoolean, GraphQLInputObjectType, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { Book } from '@definitions/models';

export default new GraphQLObjectType({
  name: 'BookMutation',
  fields: {
    create: {
      type: new GraphQLNonNull(Book.type),
      args: {
        input: {
          type: new GraphQLNonNull(new GraphQLInputObjectType({
            name: 'CreateBookInput',
            fields: {
              authorId: { type: new GraphQLNonNull(GraphQLInt) },
              title: { type: new GraphQLNonNull(GraphQLString) },
            },
          })),
        },
      },
      resolve(_, args) {
        const { input: { authorId, title } } = args;
        return Book.model.create({ title, authorId });
      },
    },

    update: {
      type: new GraphQLNonNull(Book.type),
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
        patch: {
          type: new GraphQLNonNull(new GraphQLInputObjectType({
            name: 'UpdateBookInput',
            fields: {
              title: { type: GraphQLString },
            },
          })),
        },
      },
      async resolve(_, args) {
        const { id, patch } = args;
        const book = await Book.ensureExistence(id);
        return book.update(patch);
      },
    },

    delete: {
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
