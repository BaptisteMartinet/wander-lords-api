import { GraphQLSchema } from 'graphql';
import query from './query/index.js';
import subscription from './subscription/index.js';

export default new GraphQLSchema({
  query,
  subscription,
});
