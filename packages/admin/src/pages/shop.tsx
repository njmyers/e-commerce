import * as React from 'react';
import { useRouteMatch } from 'react-router-dom';

import { Page } from '../components';
import { Shop } from '../shop';

import * as paths from '../paths';

interface ShopRouteMatch {
  shopId: string;
}

function ShopPage() {
  const match = useRouteMatch<ShopRouteMatch>(paths.SHOP_MATCH);

  return (
    <Page>
      <Shop id={Number(match?.params.shopId)} />
    </Page>
  );
}

export default ShopPage;
