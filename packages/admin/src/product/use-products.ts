import { QueryHookOptions, useQuery } from '@apollo/client';
import productsQuery from './products.graphql';

import * as Schema from '../types';

type Query = Schema.FetchProductsQuery;
type Variables = Schema.FetchProductsQueryVariables;
export type Options = QueryHookOptions<Query, Variables>;

export function useProducts(options?: Options) {
  return useQuery<Query, Variables>(productsQuery, options);
}
