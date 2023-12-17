/* eslint-disable @typescript-eslint/no-explicit-any */
import type { GraphQLFieldConfig } from 'graphql';
import type Model from '@lib/definitions';

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
  one: ExposeField;
  /**
   * Expose a field to get a list of the provided Model.
   * {@link ExposeField}
   */
  list: ExposeField;
}

export function exposeModel(model: Model<any>, opts: ExposeOpts) {
  return reduceRecord(opts, (config, exposition, exposeField) => {
    if (exposition === false)
      return config;
    config[exposition] = genExposition(model, exposeField);
    return config;
  }, {} as Record<string, GraphQLFieldConfig<unknown, unknown>>);
}

export function genExposition(model: Model<any>, exposeField: keyof ExposeOpts) {
  switch (exposeField) {
    case 'one': return genOne(model);
    case 'list': return genList(model);
    default: break;
  }
  throw new Error(`Unsupported expose field: ${exposeField}`);
}

export function genOne(model: Model<any>): GraphQLFieldConfig<unknown, unknown> {
  return {
    type: new GraphQLNonNull(model.type),
    args: {
      id: { type: new GraphQLNonNull(GraphQLInt) },
    },
    resolve(source, args) {
      const { id } = args;
      return model.ensureExistence(id);
    },
  };
}

export function genList(model: Model<any>): GraphQLFieldConfig<unknown, unknown> {
  return {
    type: new GraphQLNonNullList(model.type),
    resolve() {
      return model.model.findAll();
    },
  };
}
