import * as React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';

import { List, Card } from 'antd';

import { QueryLoader, PaginationButtons, usePagination } from '../components';
import { useProducts } from './use-products';

import * as paths from '../paths';
import { Shop, ProductsPageInfo } from '../types';

export interface ProductsProps {
  shop: Pick<Shop, 'id' | 'name' | 'description'>;
  first?: number;
  after?: string;
}

export function Products({ first = 10, shop }: ProductsProps) {
  const match = useRouteMatch(paths.SHOP_MATCH);
  const [pageInfo, setPageInfo] = React.useState<ProductsPageInfo>();
  const pagination = usePagination({
    pageInfo,
  });

  const query = useProducts({
    variables: {
      shopId: Number(shop.id),
      first,
      after: pagination.cursor.current,
    },
    onCompleted(data) {
      setPageInfo(data.shop.products.pageInfo);
    },
  });

  return (
    <QueryLoader query={query}>
      {data => {
        if (!data?.shop?.products) {
          return null;
        }

        const products = data.shop.products;
        const createProductLink = match ? `${match.url}/product/create` : '';

        return (
          <Card
            title="Products"
            extra={<Link to={createProductLink}>Create</Link>}
          >
            <List
              itemLayout="horizontal"
              dataSource={products.edges}
              renderItem={edge => {
                const productLink = match
                  ? `${match.url}/product/${edge.node.id}`
                  : '';

                const actions = [
                  <Link key="edit" to={productLink}>
                    Edit
                  </Link>,
                ];

                const price = `$${edge.node.price / 100}`;

                return (
                  <List.Item actions={actions}>
                    <List.Item.Meta
                      title={edge.node.name}
                      description={price}
                    />

                    {edge.node.description}
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
