import { GraphQLSchema } from 'graphql';
import query from './query';
import mutation from './mutation';
import subscription from './subscription';

export default new GraphQLSchema({
  query,
  subscription,
  mutation,
});
