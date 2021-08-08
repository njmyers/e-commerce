import * as React from 'react';

import { Spin, Form, Typography } from 'antd';
import { ApolloQueryResult } from '@apollo/client';

export interface QueryLoaderProps<T> {
  query: ApolloQueryResult<T>;
  children: (data: T) => React.ReactNode;
}

export function QueryLoader<T>({ query, children }: QueryLoaderProps<T>) {
  if (query.loading) {
    return <Spin />;
  }

  if (query.error) {
    return (
      <Form.ErrorList
        errors={query.error?.graphQLErrors.map(error => {
          return (
            <Typography.Text type="danger" key={error.message}>
              {error.message}
            </Typography.Text>
          );
        })}
      />
    );
  }

  return <React.Fragment>{children(query.data)}</React.Fragment>;
}
