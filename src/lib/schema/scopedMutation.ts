import type { GraphQLFieldConfig, GraphQLObjectType } from 'graphql';

import { GraphQLNonNull } from 'graphql';

export default function scopedMutation(mutation: GraphQLObjectType): GraphQLFieldConfig<unknown, unknown> {
  return {
    type: new GraphQLNonNull(mutation),
    resolve() { return {}; },
  };
}
