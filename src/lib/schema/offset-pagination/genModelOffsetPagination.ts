import type { Model as SequelizeModel } from 'sequelize';
import type { GraphQLFieldConfig } from 'graphql';
import type { Model } from '@lib/definitions';
import type { GenericOrderBy } from '@lib/schema';

import { GraphQLInt, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { GraphQLNonNullList } from '@lib/graphql';
import { genModelOrderBy, convertOrderByToSequelizeOrderItem } from '@lib/schema';

interface OffsetPaginationArgs {
  offset?: number | null,
  limit?: number | null,
  order?: GenericOrderBy[] | null,
}

export default function genModelOffsetPagination<M extends SequelizeModel>(model: Model<M>): GraphQLFieldConfig<unknown, unknown, OffsetPaginationArgs> {
  return {
    type: makeOffsetConnection(model),
    args: {
      offset: { type: GraphQLInt },
      limit: { type: GraphQLInt },
      order: { type: new GraphQLNonNullList(genModelOrderBy(model)) },
    },
    async resolve(_, args) {
      const { offset, limit, order } = args;
      const { rows: nodes, count } = await model.model.findAndCountAll({
        offset: offset ?? undefined,
        limit: limit ?? undefined,
        order: order?.map(convertOrderByToSequelizeOrderItem),
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
