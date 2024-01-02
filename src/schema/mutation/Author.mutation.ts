import type { Context } from '@lib/schema';

import { GraphQLBoolean, GraphQLInputObjectType, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { Author } from '@definitions/models';
import { RoleEnum } from '@definitions/enums';

export default new GraphQLObjectType<unknown, Context>({
  name: 'AuthorMutation',
  fields: {
    create: {
      type: new GraphQLNonNull(Author.type),
      args: {
        input: {
          type: new GraphQLNonNull(new GraphQLInputObjectType({
            name: 'CreateAuthorInput',
            fields: {
              name: { type: new GraphQLNonNull(GraphQLString) },
              role: { type: RoleEnum.gqlType },
            },
          })),
        },
      },
      resolve(_, args) {
        const { input: { name, role } } = args;
        return Author.model.create({ name, role });
      },
    },

    delete: {
      type: new GraphQLNonNull(GraphQLBoolean),
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
      },
      async resolve(_, args, ctx) {
        const { id } = args;
        const author = await Author.ensureExistence(id, { ctx });
        await author.destroy();
        return true;
      },
    },
  },
});
