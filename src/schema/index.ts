import { GraphQLSchema } from 'graphql';
import query from './query';
import subscription from './subscription';

export default new GraphQLSchema({
  query,
  subscription,
});
