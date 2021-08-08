import { QueryHookOptions, useQuery } from '@apollo/client';
import shopQuery from './shop.graphql';

import * as Schema from '../types';

type Query = Schema.FetchShopQuery;
type Variables = Schema.FetchShopQueryVariables;

export function useShopById(options?: QueryHookOptions<Query, Variables>) {
  return useQuery<Query, Variables>(shopQuery, options);
}
