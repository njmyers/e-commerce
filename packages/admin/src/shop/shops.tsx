import * as React from 'react';
import { Link } from 'react-router-dom';

import { List } from 'antd';
import { QueryLoader } from '../components/query-loader';

import { useShops } from './use-shops';
import * as paths from '../paths';
import { Shop } from '../types';

const defaultShops: Shop[] = [];

export function Shops() {
  const query = useShops();

  return (
    <QueryLoader query={query}>
      {data => {
        const shops = data?.shops ?? defaultShops;

        return (
          <List
            itemLayout="horizontal"
            dataSource={shops}
            renderItem={item => {
              const to = `${paths.SHOP}/${item.id}`;

              return (
                <List.Item>
                  <List.Item.Meta
                    title={<Link to={to}>{item.name}</Link>}
                    description={item.description}
                  />
                </List.Item>
              );
            }}
          />
        );
      }}
    </QueryLoader>
  );
}
