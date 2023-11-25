import { GraphQLSchema } from 'graphql';
import query from './query/index.js';

export default new GraphQLSchema({
  query,
});
