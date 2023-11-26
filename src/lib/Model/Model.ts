import type { ModelDefinition } from './types.js';

import { genGraphQLType } from './schema.js';

export default class Model {
  private _type;

  constructor(args: ModelDefinition) {
    this._type = genGraphQLType(args);
  }

  get name() {
    return this._type.name;
  }
}
