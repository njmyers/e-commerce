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
  shop: Shop;
  orders: Order[];
}

export async function seeder({
  password,
  ordersToCreate,
}: SeederArgs): Promise<SeederReturn> {
  const admin = await userRepo.create(Role.Admin, generate.user({ password }));
  const shop = await shopRepo.create({
    ...generate.shop(),
    products: [
      generate.product(),
      generate.product(),
      generate.product(),
      generate.product(),
      generate.product(),
      generate.product(),
      generate.product(),
    ],
    merchants: [
      generate.user({ password }),
      generate.user({ password }),
      generate.user({ password }),
      generate.user({ password }),
    ],
    customers: [
      generate.user({ password }),
      generate.user({ password }),
      generate.user({ password }),
      generate.user({ password }),
    ],
  });

  const orders: Order[] = [];

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

  return {
    admin,
    shop,
    orders,
  };
}
