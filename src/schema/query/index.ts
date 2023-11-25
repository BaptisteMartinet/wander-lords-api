import { GraphQLObjectType, GraphQLString } from 'graphql';

export default new GraphQLObjectType({
  name: 'Query',
  fields: {
    test: {
      type: GraphQLString,
      resolve() {
        return 'hello world';
      }
    },
  },
});
