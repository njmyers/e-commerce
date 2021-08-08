import * as React from 'react';

import { Row, Card, Typography, Col } from 'antd';
import { QueryLoader } from '../components/query-loader';

import { Products } from '../product/products';
import { Customers } from '../customer/customers';

import { useShopById } from './use-shop-by-id';

export interface ShopProps {
  id: number;
}

export function Shop({ id }: ShopProps) {
  const query = useShopById({
    variables: {
      id,
    },
  });

  return (
    <QueryLoader query={query}>
      {data => {
        const shop = data?.shop;

        if (!shop) {
          return null;
        }

        return (
          <>
            <Row>
              <Col xs={24}>
                <Card title={shop.name}>
                  <Typography.Paragraph>
                    {shop.description}
                  </Typography.Paragraph>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col xs={24} md={12}>
                <Products shop={shop} />
              </Col>
              <Col xs={24} md={12}>
                <Customers shop={shop} />
              </Col>
            </Row>
          </>
        );
      }}
    </QueryLoader>
  );
}
