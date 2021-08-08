import * as React from 'react';
import fetch from 'cross-fetch';
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  ApolloProvider,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

import { TOKEN_KEY } from '../constants';

export interface AdminProviderProps {
  children: React.ReactNode;
  apiUrl: string;
}

export interface ClientContext {
  headers: Record<string, string>;
}

const authorizationLink = setContext((_, { headers }: ClientContext) => {
  const token = window.localStorage.getItem(TOKEN_KEY);

  if (typeof token !== 'string') {
    return {
      headers,
    };
  }

  return {
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
  };
});

export function AdminProvider({
  apiUrl,
  children,
}: AdminProviderProps): JSX.Element {
  const client = React.useMemo(() => {
    const httpLink = createHttpLink({
      uri: `${apiUrl}/admin`,
      fetch,
    });

    return new ApolloClient({
      link: authorizationLink.concat(httpLink),
      cache: new InMemoryCache(),
    });
  }, [apiUrl]);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
