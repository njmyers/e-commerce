import * as React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

export interface AdminProviderProps {
  children: React.ReactNode;
  apiUrl: string;
}

export function AdminProvider({
  apiUrl,
  children,
}: AdminProviderProps): JSX.Element {
  const client = React.useMemo(() => {
    return new ApolloClient({
      uri: `${apiUrl}/admin`,
      cache: new InMemoryCache(),
    });
  }, [apiUrl]);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
