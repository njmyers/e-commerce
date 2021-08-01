import { Stripe } from 'stripe';

import { Order } from '../../models/order';

export type StripeLineItem = Stripe.Checkout.SessionCreateParams.LineItem;
export type StripeCheckoutSession = Stripe.Response<Stripe.Checkout.Session>;

export interface CreateStripeCheckoutSessionArgs {
  stripe: Stripe;
  order: Order;
  checkoutUrl: string;
}

export async function createStripeCheckoutSession({
  stripe,
  order,
  checkoutUrl,
}: CreateStripeCheckoutSessionArgs): Promise<StripeCheckoutSession> {
  const line_items: StripeLineItem[] = [];

  for (const lineItem of order.lineItems) {
    line_items.push({
      quantity: lineItem.quantity,
      price_data: {
        currency: 'USD',
        unit_amount: lineItem.product.price,
        tax_behavior: 'exclusive',
        product_data: {
          description: lineItem.product.description,
          name: lineItem.product.name,
          // TODO: Add tax_code to checkout
        },
      },
    });
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items,
    mode: 'payment',
    success_url: `${checkoutUrl}?success`,
    cancel_url: `${checkoutUrl}?cancel`,
    billing_address_collection: 'required',
    automatic_tax: {
      enabled: true,
    },
    shipping_address_collection: {
      allowed_countries: ['US'],
    },
  });

  return session;
}
