import * as React from 'react';
import { useRouteMatch } from 'react-router-dom';

import { useShopById } from './use-shop-by-id';
import * as paths from '../paths';

interface ShopRouteMatch {
  shopId: string;
}

export function useCurrentShop() {
  const match = useRouteMatch<ShopRouteMatch>(paths.SHOP_MATCH);
  const shopId = match?.params.shopId;

  const query = useShopById({
    variables: {
      id: Number(match?.params.shopId),
    },
  });

  React.useEffect(() => {
    void query.refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shopId]);

  return query;
}
