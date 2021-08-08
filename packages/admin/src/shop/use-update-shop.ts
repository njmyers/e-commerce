import { useMutation, MutationHookOptions } from '@apollo/client';
import updateShopMutation from './update-shop.graphql';

import * as Schema from '../types';

type Mutation = Schema.UpdateShopMutation;
type Variables = Schema.UpdateShopMutationVariables;
export type Options = MutationHookOptions<Mutation, Variables>;

export function useUpdateShop(options?: Options) {
  return useMutation<Mutation, Variables>(updateShopMutation, options);
}
