import { QueryHookOptions, useQuery } from '@apollo/client';
import customersQuery from './customers.graphql';

import * as Schema from '../types';

type Query = Schema.FetchCustomersQuery;
type Variables = Schema.FetchCustomersQueryVariables;
export type Options = QueryHookOptions<Query, Variables>;

export function useCustomers(options?: Options) {
  return useQuery<Query, Variables>(customersQuery, options);
}
