import * as React from 'react';
import { withStoreProvider } from '../../../.storybook/with-store-provider';

import { useProducts } from '../use-products';
import { useCheckoutSession } from './use-checkout-session';

export default {
  title: 'merchant/useCheckoutSession',
  decorators: [withStoreProvider],
};

export const Default = () => {
  const { checkout } = useCheckoutSession();
  const query = useProducts();

  if (query.loading) {
    return 'loading';
  }

  if (query.error) {
    return 'error';
  }

  const product = query.data?.products.edges[0].node;

  if (!product) {
    return 'no product';
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void checkout({
      variables: {
        input: {
          checkoutUrl: `http://localhost:6006/iframe.html?id=src-usecheckout--default&viewMode=story`,
          lineItems: [
            {
              quantity: 1,
              product: {
                id: product.id,
              },
            },
          ],
        },
      },
    });
  };

  return (
    <section>
      <div className="product">
        <img
          src="https://i.imgur.com/EHyR2nP.png"
          alt="The cover of Stubborn Attachments"
        />
        <div className="description">
          <h3>{product.name}</h3>
          <h5>${product.price / 100}</h5>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <button type="submit">Checkout</button>
      </form>
    </section>
  );
};
