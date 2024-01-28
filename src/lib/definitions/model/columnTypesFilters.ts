import type { WhereAttributeHash, WhereOptions } from 'sequelize';
import type { GraphQLInputFieldConfigMap, GraphQLNamedInputType } from 'graphql';

import assert from 'assert';
import { Op } from 'sequelize';
import { GraphQLInputObjectType, GraphQLInputType, GraphQLBoolean, GraphQLFloat, GraphQLID, GraphQLInt, GraphQLString } from 'graphql';
import { GraphQLNonNullList } from '@lib/graphql';
import { mapRecord } from '@lib/utils/object';

interface FilterDefinition {
  transformValueType?: (type: GraphQLInputType) => GraphQLInputType,
  resolve: (value: unknown) => WhereAttributeHash,
  description: string,
}

type FilterDefinitionObjMap = Record<string, FilterDefinition>;

const BaseFilterDefinitions = {
  eq: {
    resolve: (value) => ({ [Op.eq]: value }),
    description: 'Equal',
  },
  ne: {
    resolve: (value) => ({ [Op.ne]: value }),
    description: 'Not equal',
  },
  in: {
    transformValueType: (type) => new GraphQLNonNullList(type),
    resolve: (value) => ({ [Op.in]: value }),
    description: 'In',
  },
  notIn: {
    transformValueType: (type) => new GraphQLNonNullList(type),
    resolve: (value) => ({ [Op.notIn]: value }),
    description: 'Not in',
  },
} as const satisfies FilterDefinitionObjMap;

const NumericFilterDefinitions = {
  lt: {
    resolve: (value) => ({ [Op.lt]: value }),
    description: 'Less than',
  },
  lte: {
    resolve: (value) => ({ [Op.lte]: value }),
    description: 'Less than or equal',
  },
  gt: {
    resolve: (value) => ({ [Op.gt]: value }),
    description: 'Greater than',
  },
  gte: {
    resolve: (value) => ({ [Op.gte]: value }),
    description: 'Greater than or equal',
  },
} as const satisfies FilterDefinitionObjMap;

const StringFilterDefinitions = {
  contains: {
    resolve: (value) => ({ [Op.substring]: value }),
    description: 'Contains substring',
  },
  startsWith: {
    resolve: (value) => ({ [Op.startsWith]: value }),
    description: 'Starts with substring',
  },
  endsWith: {
    resolve: (value) => ({ [Op.endsWith]: value }),
    description: 'Ends with substring',
  },
} as const satisfies FilterDefinitionObjMap;

const AllFilterDefinitions = {
  ...BaseFilterDefinitions,
  ...NumericFilterDefinitions,
  ...StringFilterDefinitions,
} as const;

type FilterKey = keyof typeof AllFilterDefinitions;

function assertFilterKey(key: string): asserts key is FilterKey {
  assert(key in AllFilterDefinitions);
}

export function makeFiltersType(type: GraphQLNamedInputType, filtersDefinition?: FilterDefinitionObjMap) {
  const filters: FilterDefinitionObjMap = { ...BaseFilterDefinitions, ...filtersDefinition };
  const fields: GraphQLInputFieldConfigMap = mapRecord(filters, (def) => {
    const { transformValueType, description } = def;
    const transformedType = transformValueType ? transformValueType(type) : type;
    return { type: transformedType, description };
  });
  return new GraphQLInputObjectType({
    name: type.name + 'Filters',
    fields,
  });
}

export const IntFilter = makeFiltersType(GraphQLInt, NumericFilterDefinitions);
export const FloatFilter = makeFiltersType(GraphQLFloat, NumericFilterDefinitions);
export const StringFilter = makeFiltersType(GraphQLString, StringFilterDefinitions);
export const IDFilter = makeFiltersType(GraphQLID);
export const BooleanFilter = makeFiltersType(GraphQLBoolean);

export function resolveFilter(filter: Record<FilterKey, unknown>): WhereOptions {
  const conditions: Array<WhereOptions> = [];
  for (const filterKey in filter) {
    assertFilterKey(filterKey);
    const value = filter[filterKey];
    const filterDefinition = AllFilterDefinitions[filterKey];
    const { resolve } = filterDefinition;
    conditions.push(resolve(value));
  }
  return { [Op.and]: conditions };
}

export function resolveFilters(filters: Record<string/*column*/, Record<FilterKey, unknown>>): WhereOptions {
  const conditions: Array<WhereOptions> = [];
  for (const fieldName in filters) {
    const filter = filters[fieldName];
    assert(filter !== undefined);
    const resolvedFilter = resolveFilter(filter);
    conditions.push({ [fieldName]: resolvedFilter });
  }
  return { [Op.and]: conditions };
}
