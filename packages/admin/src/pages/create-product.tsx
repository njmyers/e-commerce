import * as React from 'react';

import { Page, QueryLoader } from '../components';
import { CreateProduct } from '../product';
import { useCurrentShop } from '../shop';

export default function CreateProductPage() {
  const query = useCurrentShop();

  return (
    <Page>
      <QueryLoader query={query}>
        {data => {
          const shop = data?.shop;

          if (!shop) {
            return null;
          }

          return <CreateProduct shop={shop} />;
        }}
      </QueryLoader>
    </Page>
  );
}
