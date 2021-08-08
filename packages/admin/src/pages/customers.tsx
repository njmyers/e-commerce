import * as React from 'react';

import { Page, QueryLoader } from '../components';
import { Customers } from '../customer';
import { useCurrentShop } from '../shop';

function CustomersPage() {
  const query = useCurrentShop();

  return (
    <Page>
      <QueryLoader query={query}>
        {data => {
          const shop = data?.shop;

          if (!shop) {
            return null;
          }

          return <Customers shop={shop} />;
        }}
      </QueryLoader>
    </Page>
  );
}

export default CustomersPage;
