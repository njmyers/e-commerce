import * as React from 'react';

import { Page, QueryLoader } from '../components';
import { Products } from '../product';
import { useCurrentShop } from '../shop';

function ProductsPage() {
  const query = useCurrentShop();

  return (
    <Page>
      <QueryLoader query={query}>
        {data => {
          const shop = data?.shop;

          if (!shop) {
            return null;
          }

          return <Products shop={shop} />;
        }}
      </QueryLoader>
    </Page>
  );
}

export default ProductsPage;
