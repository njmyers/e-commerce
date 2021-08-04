import * as React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

export interface StoreProviderProps {
  children: React.ReactNode;
  storeName: string;
  apiUrl: string;
}

export function StoreProvider({
  storeName,
  apiUrl,
  children,
}: StoreProviderProps): JSX.Element {
  const client = React.useMemo(() => {
    return new ApolloClient({
      uri: `${apiUrl}/${storeName}`,
      cache: new InMemoryCache(),
    });
  }, [apiUrl, storeName]);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
