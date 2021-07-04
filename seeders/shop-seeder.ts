import { generate } from '../test/data';

import { shopRepo } from '../src/domains/shop';
import { orderRepo } from '../src/domains/billing';

import { orm } from '../src/lib/context';

const TEST_PASSWORD = 'testpassword';
const ORDERS_TO_CREATE = 100;

async function seed() {
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
      generate.user({ password: TEST_PASSWORD }),
      generate.user({ password: TEST_PASSWORD }),
      generate.user({ password: TEST_PASSWORD }),
      generate.user({ password: TEST_PASSWORD }),
    ],
    customers: [
      generate.user({ password: TEST_PASSWORD }),
      generate.user({ password: TEST_PASSWORD }),
      generate.user({ password: TEST_PASSWORD }),
      generate.user({ password: TEST_PASSWORD }),
    ],
  });

  for (let i = 0; i < ORDERS_TO_CREATE; i += 1) {
    console.log(`Creating ${i + 1} order of ${ORDERS_TO_CREATE}`);

    await orderRepo.create({
      tax: 10,
      customer: shop.customers[0],
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
  }
}

(async () => {
  try {
    await orm.run(async em => {
      await seed();
      await em.flush();
    });
    console.log('Finished seeding the DB');
  } catch (error) {
    console.error('Error seeding DB', { error });
  } finally {
    console.log('Cleaning up');
    await orm.close();
  }
})();
