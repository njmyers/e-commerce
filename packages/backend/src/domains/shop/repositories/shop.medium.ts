import { shopRepo } from './shop';
import { orm } from '../../../lib/context';
import { generate } from '../../../../test/data';

describe('shopRepo', () => {
  afterAll(async () => {
    await orm.close();
  });

  describe('create', () => {
    test('should create a shop record', async () => {
      await orm.runAndRevert(async em => {
        const { shop, shopInput } = await setupTest();
        await em.flush();

        expect(shop).toMatchObject(shopInput);
      });
    });

    test('should create an merchant record', async () => {
      await orm.runAndRevert(async em => {
        const { shop, merchantInput } = await setupTest();
        await em.flush();

        expect(shop.merchants).toHaveLength(1);
        expect(shop.merchants.getItems()[0]).toMatchObject({
          name: merchantInput.name,
          email: merchantInput.email,
        });
      });
    });

    test('should create a customer record', async () => {
      await orm.runAndRevert(async em => {
        const { shop, customerInput } = await setupTest();
        await em.flush();

        expect(shop.customers).toHaveLength(1);
        expect(shop.customers.getItems()[0]).toMatchObject({
          name: customerInput.name,
          email: customerInput.email,
        });
      });
    });

    test('should create product records', async () => {
      await orm.runAndRevert(async em => {
        const { shop, productInput1, productInput2 } = await setupTest();
        await em.flush();

        const products = shop.products.toJSON();
        expect(products).toHaveLength(2);
        expect(products).toContainEqual(
          expect.objectContaining({
            ...productInput1,
            shop: shop.id,
          })
        );

        expect(products).toContainEqual(
          expect.objectContaining({
            ...productInput2,
            shop: shop.id,
          })
        );
      });
    });
  });

  describe('update', () => {
    test('should update shop fields', async () => {
      await orm.runAndRevert(async em => {
        const { shop } = await setupTest();
        await em.flush();

        const shopUpdateInput = generate.shop();
        const updatedShop = await shopRepo.update(shop.id, shopUpdateInput);

        expect(updatedShop).toMatchObject(shopUpdateInput);
      });
    });

    test('should add an merchant record', async () => {
      await orm.runAndRevert(async em => {
        const { shop } = await setupTest();
        const merchantUpdates = generate.user();
        await em.flush();

        const updatedShop = await shopRepo.update(shop.id, {
          merchants: [merchantUpdates],
        });

        await em.flush();

        expect(updatedShop.merchants).toHaveLength(2);
        expect(updatedShop.merchants.getItems()[1]).toMatchObject({
          name: merchantUpdates.name,
          email: merchantUpdates.email,
        });
      });
    });

    test('should add a customer record', async () => {
      await orm.runAndRevert(async em => {
        const { shop } = await setupTest();
        await em.flush();

        const customerUpdates = generate.user();
        const updatedShop = await shopRepo.update(shop.id, {
          customers: [customerUpdates],
        });

        await em.flush();

        expect(updatedShop.customers).toHaveLength(2);
        expect(updatedShop.customers.getItems()[1]).toMatchObject({
          name: customerUpdates.name,
          email: customerUpdates.email,
        });
      });
    });

    // test('should create product records', async () => {
    //   await orm.runAndRevert(async () => {
    //     const { shop, productInput1, productInput2 } = await setupTest();

    //     const products = shop.products.toJSON();
    //     expect(products).toHaveLength(2);
    //     expect(products).toContainEqual(
    //       expect.objectContaining({
    //         ...productInput1,
    //         shop: shop.id,
    //       })
    //     );

    //     expect(products).toContainEqual(
    //       expect.objectContaining({
    //         ...productInput2,
    //         shop: shop.id,
    //       })
    //     );
    //   });
    // });
  });

  describe('findById', () => {
    test('should find a shop by id', async () => {
      await orm.runAndRevert(async em => {
        const { shop } = await setupTest();
        await em.flush();

        const found = await shopRepo.findById(shop.id);
        expect(found).toMatchObject(shop);
      });
    });
  });

  describe('findByName', () => {
    test('should find a shop by name', async () => {
      await orm.runAndRevert(async em => {
        const { shop } = await setupTest();
        await em.flush();

        const found = await shopRepo.findByName(shop.name);
        expect(found).toMatchObject(shop);
      });
    });
  });

  describe('findProductById', () => {
    test('should find a shop by id', async () => {
      await orm.runAndRevert(async em => {
        const { shop } = await setupTest();
        await em.flush();

        const [product] = shop.products.getItems();
        const found = await shopRepo.findProductById(product.id);

        expect(found).toMatchObject(product);
      });
    });
  });
});

async function setupTest() {
  const shopInput = generate.shop();
  const productInput1 = generate.product();
  const productInput2 = generate.product();
  const merchantInput = generate.user();
  const customerInput = generate.user();

  const shop = await shopRepo.create({
    ...shopInput,
    merchants: [merchantInput],
    customers: [customerInput],
    products: [productInput1, productInput2],
  });

  return {
    shop,
    shopInput,
    productInput1,
    productInput2,
    merchantInput,
    customerInput,
  };
}
