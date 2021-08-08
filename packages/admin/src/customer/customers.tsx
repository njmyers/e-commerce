import * as React from 'react';
import { List, Card } from 'antd';

import { QueryLoader, PaginationButtons, usePagination } from '../components';
import { useCustomers } from './use-customers';

import { Shop, CustomerPageInfo } from '../types';

export interface CustomerProps {
  shop: Pick<Shop, 'id' | 'name' | 'description'>;
  first?: number;
  after?: string;
}

export function Customers({ first = 10, shop }: CustomerProps) {
  const [pageInfo, setPageInfo] = React.useState<CustomerPageInfo>();
  const pagination = usePagination({
    pageInfo,
  });

  const query = useCustomers({
    variables: {
      shopId: Number(shop.id),
      first,
      after: pagination.cursor.current,
    },
    onCompleted(data) {
      setPageInfo(data.shop.customers.pageInfo);
    },
  });

  return (
    <QueryLoader query={query}>
      {data => {
        if (!data?.shop?.customers) {
          return null;
        }

        const customers = data.shop.customers;

        return (
          <Card title="Customers">
            <List
              itemLayout="horizontal"
              dataSource={customers.edges}
              renderItem={edge => {
                return (
                  <List.Item>
                    <List.Item.Meta
                      title={edge.node.name}
                      description={edge.node.email}
                    />
                  </List.Item>
                );
              }}
            />
            <PaginationButtons {...pagination} />
          </Card>
        );
      }}
    </QueryLoader>
  );
}
