import * as React from 'react';
import { withStoreProvider } from '../../../.storybook/with-store-provider';

import { useProducts } from './use-products';

export default {
  title: 'merchant/useProducts',
  decorators: [withStoreProvider],
};

export const Default = () => {
  const query = useProducts();

  if (query.loading) {
    return 'loading';
  }

  if (query.error) {
    return 'error';
  }

  return (
    <section>
      {query.data?.products.edges.map(edge => {
        return (
          <div key={edge.node.id}>
            <h3>{edge.node.name}</h3>
            <h5>{edge.node.description}</h5>
            <img alt="product" src="https://i.imgur.com/EHyR2nP.png" />
            <h5>Price ${edge.node.price / 100}</h5>
            <h5>
              {edge.node.length}mm x {edge.node.width}mm x {edge.node.height}mm
            </h5>
          </div>
        );
      })}
    </section>
  );
};
