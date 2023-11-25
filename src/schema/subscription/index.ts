import { GraphQLObjectType, GraphQLBoolean } from 'graphql';
import { PubSub } from 'graphql-subscriptions';

export const pubsub = new PubSub();

export default new GraphQLObjectType({
  name: 'Subscription',
  fields: {
    test: {
      type: GraphQLBoolean,
      subscribe: () => pubsub.asyncIterator('TEST_TRIGGER'),
    },
  },
});
