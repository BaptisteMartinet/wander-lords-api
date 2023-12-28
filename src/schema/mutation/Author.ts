import { GraphQLInputObjectType, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { Author } from '@definitions/models';
import { RoleEnum } from '@definitions/enums';

export default new GraphQLObjectType({
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
  },
});
