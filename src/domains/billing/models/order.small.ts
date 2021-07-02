import { Order } from './order';
import { orm } from '../../../lib/context';

import { Product } from '../../shop/models';

import { generate } from '../../../../test/data';
import { LineItem } from './line-item';

describe('Order', () => {
  afterAll(async () => {
    await orm.close();
  });

  describe('get total()', () => {
    test('when no line items should return 0', async () => {
      await orm.runAndRevert(() => {
        const order = new Order(generate.order());
        expect(order.total).toBe(0);
      });
    });

    test('when line items should sum together the line item products', async () => {
      await orm.runAndRevert(() => {
        const product = new Product(generate.product());
        const lineItem = new LineItem({ ...generate.lineItem(), product });
        const order = new Order(generate.order());
        order.lineItems.add(lineItem);

        expect(order.total).toBe(lineItem.quantity * product.price);
      });
    });
  });
});
