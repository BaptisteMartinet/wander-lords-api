/* eslint-disable @typescript-eslint/no-explicit-any */
import type { GraphQLFieldConfig } from 'graphql';
import type { Identifier } from 'sequelize';
import type { Model } from '@lib/definitions';
import type { Context } from '@lib/schema';

import { GraphQLInt, GraphQLNonNull } from 'graphql';
import { GraphQLNonNullList } from '@lib/graphql';
import { reduceRecord } from '@lib/utils/object';

/**
 * Either the name of the exposed field or false to disable the exposition
 */
export type ExposeField = string | false;

export interface ExposeOpts {
  /**
   * Expose a field to get the provided Model by id.
   * {@link ExposeField}
   */
  findById: ExposeField;
  /**
   * Expose a field to get the provided Model by ids.
   */
  findByIds: ExposeField;
  /**
   * Expose a field to get a list of the provided Model.
   * {@link ExposeField}
   */
  list: ExposeField;
}

export default function exposeModel(model: Model<any>, opts: ExposeOpts) {
  return reduceRecord(opts, (config, exposition, exposeField) => {
    if (exposition === false)
      return config;
    config[exposition] = genExposition(model, exposeField);
    return config;
  }, {} as Record<string, GraphQLFieldConfig<unknown, Context>>);
}

function genExposition(model: Model<any>, exposeField: keyof ExposeOpts) {
  switch (exposeField) {
    case 'findById': return genFindById(model);
    case 'findByIds': return genFindByIds(model);
    case 'list': return genList(model);
    default: break;
  }
  throw new Error(`Unsupported expose field: ${exposeField}`);
}

function genFindById(model: Model<any>): GraphQLFieldConfig<unknown, Context, { id: Identifier }> {
  return {
    type: new GraphQLNonNull(model.type),
    args: {
      id: { type: new GraphQLNonNull(GraphQLInt) },
    },
    resolve(source, args, ctx) {
      const { id } = args;
      return model.ensureExistence(id, { ctx });
    },
  };
}

function genFindByIds(model: Model<any>): GraphQLFieldConfig<unknown, Context, { ids: Array<Identifier> }> {
  return {
    type: new GraphQLNonNull(new GraphQLNonNullList(model.type)),
    args: {
      ids: { type: new GraphQLNonNull(new GraphQLNonNullList(GraphQLInt)) },
    },
    resolve(source, args, ctx) {
      const { ids } = args;
      return Promise.all(ids.map(id => model.ensureExistence(id, { ctx })));
    },
  };
}

function genList(model: Model<any>): GraphQLFieldConfig<unknown, Context> {
  return {
    type: new GraphQLNonNullList(model.type),
    resolve() {
      return model.model.findAll();
    },
  };
}
