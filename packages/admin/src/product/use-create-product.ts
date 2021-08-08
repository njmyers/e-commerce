import { useMutation, MutationHookOptions } from '@apollo/client';
import createProductMutation from './create-product.graphql';

import * as Schema from '../types';

type Mutation = Schema.CreateProductMutation;
type Variables = Schema.CreateProductMutationVariables;
export type Options = MutationHookOptions<Mutation, Variables>;

export function useCreateProduct(options?: Options) {
  return useMutation<Mutation, Variables>(createProductMutation, options);
}
