import { ModelLoader } from '@lib/definitions';

export interface Context {
  loader: ModelLoader,
}

export function makeContext(): Context {
  return {
    loader: new ModelLoader(),
  };
}
