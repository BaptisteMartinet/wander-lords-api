import type { Model as SequelizeModel } from 'sequelize';
import type { GraphQLFieldConfig } from 'graphql';
import type { Model } from '@lib/definitions';

import { GraphQLInt, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { GraphQLNonNullList } from '@lib/graphql';

export interface OffsetPaginationArgs {
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
      const nodes = await model.model.findAll({
        offset: offset ?? undefined,
        limit: limit ?? undefined,
      });
      const totalCount = await model.model.count();
      return { nodes, totalCount };
    },
  };
}

function makeOffsetConnection<M extends SequelizeModel>(model: Model<M>) {
  return new GraphQLObjectType({
    name: model.name + 'OffsetConnection',
    fields: {
      nodes: { type: new GraphQLNonNullList(model.type) },
      totalCount: { type: new GraphQLNonNull(GraphQLInt) },
    },
  });
}
