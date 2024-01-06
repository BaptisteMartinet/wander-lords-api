import type { Model as SequelizeModel, OrderItem } from 'sequelize';

import { GraphQLEnumType, GraphQLInputObjectType, GraphQLNonNull } from 'graphql';
import { Model } from '@lib/definitions';
import { mapRecord } from '@lib/utils/object';
import { cacheGraphQLType } from '@lib/schema';

export enum OrderType {
  ASC = 'ASC',
  DESC = 'DESC',
}

export const OrderTypeEnum = new GraphQLEnumType({
  name: 'OrderType',
  values: {
    ASC: { value: 'ASC' },
    DESC: { value: 'DESC' },
  },
});

export function genModelFieldsEnum<M extends SequelizeModel>(model: Model<M>) {
  return cacheGraphQLType(
    new GraphQLEnumType({
      name: model.name + 'Fields',
      values: mapRecord(model.model.getAttributes(), (_, key) => ({ value: key })),
    })
  );
}

export interface GenericOrderBy {
  field: string;
  ordering: OrderType;
}

export default function genModelOrderBy<M extends SequelizeModel>(model: Model<M>) {
  return cacheGraphQLType(
    new GraphQLInputObjectType({
      name: model.name + 'OrderBy',
      fields: {
        field: { type: new GraphQLNonNull(genModelFieldsEnum(model)) },
        ordering: { type: new GraphQLNonNull(OrderTypeEnum) }
      },
    })
  );
}

export function convertOrderByToSequelizeOrderItem(orderBy: GenericOrderBy): OrderItem {
  const { field, ordering } = orderBy;
  return [field, ordering];
}