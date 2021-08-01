import { Stripe } from 'stripe';
import { Shop } from '../../models/shop';

import { getSecret, ServiceProvider } from '../secrets';
import { config } from '../../config';

export async function createStripe(shop: Shop): Promise<Stripe> {
  const { scoped, stripe } = config.get('providers');

  const stripeToken = scoped
    ? await getSecret({
        shopName: shop.name,
        serviceProvider: ServiceProvider.Stripe,
        keyName: 'stripeToken',
      })
    : stripe.token;

  return new Stripe(stripeToken, {
    apiVersion: '2020-08-27',
  });
}
