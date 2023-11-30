import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { User } from '@definitions/models';
import { RoleEnum } from '@definitions/enums';

export default new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createUser: {
      type: new GraphQLNonNull(User.type),
      args: {
        username: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        role: { type: RoleEnum.gqlType },
      },
      resolve(_, args) {
        const { username, email, role } = args;
        console.log(role);
        return User.model.create({
          username,
          email,
          role,
        });
      },
    },
  },
});
