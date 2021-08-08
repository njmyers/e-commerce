import { generate } from '../test/data';

import { Shop } from '../src/models/shop';
import { Admin } from '../src/models/admin';

import { shopRepo } from '../src/repositories/shop';
import { userRepo } from '../src/repositories/user';

import { Order } from '../src/models/order';
import { orderRepo } from '../src/repositories/order';

import { Role } from '../src/lib/permissions';

export interface SeederArgs {
  password: string;
  ordersToCreate: number;
}

export interface SeederReturn {
  admin: Admin;
  shops: Shop[];
  orders: Order[];
}

export async function seeder({
  password,
  ordersToCreate,
}: SeederArgs): Promise<SeederReturn> {
  const admin = await userRepo.create(Role.Admin, generate.user({ password }));
  const merchant1 = generate.user({ password });
  const merchant2 = generate.user({ password });

  const shop1 = await shopRepo.create({
    ...generate.shop(),
    products: [
      generate.product(),
      generate.product(),
      generate.product(),
      generate.product(),
      generate.product(),
      generate.product(),
      generate.product(),
      generate.product(),
      generate.product(),
      generate.product(),
      generate.product(),
      generate.product(),
      generate.product(),
      generate.product(),
      generate.product(),
      generate.product(),
      generate.product(),
      generate.product(),
      generate.product(),
      generate.product(),
      generate.product(),
    ],
    merchants: [merchant1],
    customers: [
      generate.user({ password }),
      generate.user({ password }),
      generate.user({ password }),
      generate.user({ password }),
    ],
  });

  const shop2 = await shopRepo.create({
    ...generate.shop(),
    products: [
      generate.product(),
      generate.product(),
      generate.product(),
      generate.product(),
      generate.product(),
      generate.product(),
      generate.product(),
      generate.product(),
      generate.product(),
      generate.product(),
      generate.product(),
      generate.product(),
      generate.product(),
      generate.product(),
      generate.product(),
      generate.product(),
      generate.product(),
      generate.product(),
      generate.product(),
      generate.product(),
      generate.product(),
    ],
    merchants: [merchant2],
    customers: [
      generate.user({ password }),
      generate.user({ password }),
      generate.user({ password }),
      generate.user({ password }),
    ],
  });

  const shops = [shop1, shop2];
  const orders: Order[] = [];

  for (const shop of shops) {
    for (let i = 0; i < ordersToCreate; i += 1) {
      const order = orderRepo.create({
        tax: 10,
        customer: shop.customers[0],
        shippingAddress: generate.address(),
        billingAddress: generate.address(),
        lineItems: [
          {
            ...generate.lineItem(),
            product: shop.products[0],
          },
          {
            ...generate.lineItem(),
            product: shop.products[1],
          },
        ],
      });

      orders.push(order);
    }
  }

  return {
    admin,
    shops,
    orders,
  };
}
