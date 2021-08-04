import { createStripeCheckoutSession } from './create-stripe-checkout-session';
import { generate } from '../../../test/data';
import { Product, LineItem, Order } from '../../models';
import { orm } from '../../lib/orm';

const checkoutUrl = 'http://localhost:9000';
const stripe = {
  checkout: {
    sessions: {
      create: jest.fn(),
    },
  },
};

describe('createCheckoutSession', () => {
  afterAll(async () => {
    await orm.close();
  });

  test('should create a stripe checkout session', async () => {
    await orm.runAndRevert(async () => {
      const order = await setupTest();
      const [lineItem] = order.lineItems;

      expect(stripe.checkout.sessions.create).toHaveBeenCalledWith({
        payment_method_types: ['card'],
        line_items: [
          {
            quantity: lineItem.quantity,
            price_data: {
              currency: 'USD',
              unit_amount: lineItem.product.price,
              tax_behavior: 'exclusive',
              product_data: {
                description: lineItem.product.description,
                name: lineItem.product.name,
                metadata: {
                  productId: lineItem.product.id,
                },
              },
            },
          },
        ],
        mode: 'payment',
        success_url: `${checkoutUrl}?success`,
        cancel_url: `${checkoutUrl}?cancel`,
        billing_address_collection: 'required',
        metadata: {
          lineItems: JSON.stringify([
            {
              quantity: lineItem.quantity,
              productId: lineItem.product.id,
            },
          ]),
        },
        automatic_tax: {
          enabled: true,
        },
        shipping_address_collection: {
          allowed_countries: ['US'],
        },
      });
    });
  });
});

async function setupTest(): Promise<Order> {
  const order = new Order(generate.order());
  const product = new Product(generate.product());
  const lineItem = new LineItem({ ...generate.lineItem(), product });

  order.lineItems.add(lineItem);

  // @ts-expect-error stripe is mocked here
  await createStripeCheckoutSession({ checkoutUrl, stripe, order });
  return order;
}
