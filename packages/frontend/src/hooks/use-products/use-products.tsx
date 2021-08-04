import { QueryHookOptions, useQuery } from '@apollo/client';
import query from './products.graphql';

import * as Schema from '../../merchant-types';

type Query = Schema.FetchProductsQuery;
type Variables = Schema.FetchProductsQueryVariables;

export function useProducts(options?: QueryHookOptions<Query, Variables>) {
  return useQuery<Query, Variables>(query, options);
}
