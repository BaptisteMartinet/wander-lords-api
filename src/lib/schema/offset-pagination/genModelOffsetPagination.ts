import type { Model as SequelizeModel } from 'sequelize';
import type { GraphQLFieldConfig } from 'graphql';
import type { Model } from '@lib/definitions';

import { GraphQLInt, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { GraphQLNonNullList } from '@lib/graphql';

interface OffsetPaginationArgs {
  offset?: number | null,
  limit?: number | null,
}

export default function genModelOffsetPagination<M extends SequelizeModel>(model: Model<M>): GraphQLFieldConfig<unknown, unknown, OffsetPaginationArgs> {
  return {
    type: makeOffsetConnection(model),
    args: {
      offset: { type: GraphQLInt },
      limit: { type: GraphQLInt },
    },
    async resolve(_, args) {
      const { offset, limit } = args;
      const { rows: nodes, count } = await model.model.findAndCountAll({
        offset: offset ?? undefined,
        limit: limit ?? undefined,
      });
      return { nodes, count };
    },
  };
}

function makeOffsetConnection<M extends SequelizeModel>(model: Model<M>) {
  return new GraphQLObjectType({
    name: model.name + 'OffsetConnection',
    fields: () => ({
      nodes: { type: new GraphQLNonNullList(model.type) },
      count: { type: new GraphQLNonNull(GraphQLInt) },
    }),
  });
}
