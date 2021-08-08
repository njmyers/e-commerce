import { QueryHookOptions, useQuery } from '@apollo/client';
import shopsQuery from './shops.graphql';

import * as Schema from '../types';

type Query = Schema.FetchShopsQuery;
type Variables = Schema.FetchShopsQueryVariables;

export function useShops(options?: QueryHookOptions<Query, Variables>) {
  return useQuery<Query, Variables>(shopsQuery, options);
}
