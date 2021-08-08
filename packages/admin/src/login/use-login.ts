import { MutationHookOptions, useMutation } from '@apollo/client';
import loginMutation from './login.graphql';

import * as Schema from '../types';

type Mutation = Schema.LoginMutation;
type Variables = Schema.LoginMutationVariables;
export type Options = MutationHookOptions<Mutation, Variables>;

export function useLogin(options?: Options) {
  return useMutation<Mutation, Variables>(loginMutation, options);
}
