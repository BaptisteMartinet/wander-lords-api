/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Model as SequelizeModel, WhereOptions, Attributes } from 'sequelize';
import type { GraphQLFieldConfig, GraphQLFieldConfigArgumentMap, GraphQLNamedOutputType, GraphQLOutputType } from 'graphql';
import type { Model } from '@lib/definitions';
import type { GenericOrderBy } from '@lib/schema';

import { GraphQLInt, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { GraphQLNonNullList } from '@lib/graphql';
import { genModelOrderBy, convertOrderByToSequelizeOrderItem, cacheGraphQLType } from '@lib/schema';

export interface OffsetPaginationGraphQLArgs {
  offset?: number | null,
  limit?: number | null,
  order?: GenericOrderBy[] | null,
  [key: string]: unknown, // Custom args
}
export type OffsetPaginationGraphQLFieldConfig = GraphQLFieldConfig<unknown, unknown, OffsetPaginationGraphQLArgs>;

export interface OffsetPaginationOpts<M extends SequelizeModel> {
  outputType?: GraphQLNamedOutputType,
  args?: GraphQLFieldConfigArgumentMap,
  where?: (args: any) => WhereOptions<Attributes<M>>,
}

export default function genModelOffsetPagination<M extends SequelizeModel>(
  model: Model<M>,
  opts: OffsetPaginationOpts<M> = {}
): OffsetPaginationGraphQLFieldConfig {
  const { outputType, args, where: whereGetter } = opts;
  const nodeType = outputType ?? model.type;
  const name = nodeType.name;
  return {
    type: makeOffsetConnection(name, nodeType),
    args: {
      ...args,
      offset: { type: GraphQLInt },
      limit: { type: GraphQLInt },
      order: { type: new GraphQLNonNullList(genModelOrderBy(model)) },
    },
    async resolve(_, args) {
      const { offset, limit, order, ...customArgs } = args;
      const where = whereGetter?.(customArgs);
      const { rows: nodes, count } = await model.model.findAndCountAll({
        offset: offset ?? undefined,
        limit: limit ?? undefined,
        order: order?.map(convertOrderByToSequelizeOrderItem),
        where: where,
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
