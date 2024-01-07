import type { Model as SequelizeModel } from 'sequelize';
import type { GraphQLFieldConfig, GraphQLOutputType } from 'graphql';
import type { Model } from '@lib/definitions';
import type { GenericOrderBy } from '@lib/schema';

import { GraphQLInt, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { GraphQLNonNullList } from '@lib/graphql';
import { genModelOrderBy, convertOrderByToSequelizeOrderItem, cacheGraphQLType } from '@lib/schema';

export interface OffsetPaginationGraphQLArgs {
  offset?: number | null,
  limit?: number | null,
  order?: GenericOrderBy[] | null,
}
export type OffsetPaginationGraphQLFieldConfig = GraphQLFieldConfig<unknown, unknown, OffsetPaginationGraphQLArgs>;

export interface OffsetPaginationOpts {
  outputType?: GraphQLOutputType,
}

export default function genModelOffsetPagination<M extends SequelizeModel>(model: Model<M>, opts: OffsetPaginationOpts = {}): OffsetPaginationGraphQLFieldConfig {
  const { outputType } = opts;
  const nodeType = outputType ?? model.type;
  return {
    type: makeOffsetConnection(model.name, nodeType),
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

function makeOffsetConnection(name: string, nodeType: GraphQLOutputType) {
  return cacheGraphQLType(
    new GraphQLObjectType({
      name: name + 'OffsetConnection',
      fields: () => ({
        nodes: { type: new GraphQLNonNullList(nodeType) },
        count: { type: new GraphQLNonNull(GraphQLInt) },
      }),
    })
  );
}
