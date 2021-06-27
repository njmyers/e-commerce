import { shopRepo } from './shop';
import { orm } from '../../../lib/context';
import { generate } from '../../../../test/data';

describe('shopRepo', () => {
  afterAll(async () => {
    await orm.close();
  });

  describe('create', () => {
    test('should create a shop record', async () => {
      await orm.runAndRevert(async () => {
        const { shop, shopInput } = await setupTest();
        expect(shop).toMatchObject(shopInput);
      });
    });

    test('should create an admin record', async () => {
      await orm.runAndRevert(async () => {
        const { shop, adminInput } = await setupTest();

        expect(shop.admins).toHaveLength(1);
        expect(shop.admins.getItems()[0].user).toMatchObject({
          name: adminInput.name,
          email: adminInput.email,
        });
      });
    });

    test('should create a customer record', async () => {
      await orm.runAndRevert(async () => {
        const { shop, customerInput } = await setupTest();

        expect(shop.customers).toHaveLength(1);
        expect(shop.customers.getItems()[0].user).toMatchObject({
          name: customerInput.name,
          email: customerInput.email,
        });
      });
    });

    test('should create product records', async () => {
      await orm.runAndRevert(async () => {
        const { shop, productInput1, productInput2 } = await setupTest();

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
      await orm.runAndRevert(async () => {
        const { shop } = await setupTest();

        const shopUpdateInput = generate.shop();
        const updatedShop = await shopRepo.update(shop.id, shopUpdateInput);

        expect(updatedShop).toMatchObject(shopUpdateInput);
      });
    });

    test('should add an admin record', async () => {
      await orm.runAndRevert(async () => {
        const { shop } = await setupTest();
        const adminUpdates = generate.user();

        const updatedShop = await shopRepo.update(shop.id, {
          admins: [adminUpdates],
        });

        expect(updatedShop.admins).toHaveLength(2);
        expect(updatedShop.admins.getItems()[1].user).toMatchObject({
          name: adminUpdates.name,
          email: adminUpdates.email,
        });
      });
    });

    test('should add a customer record', async () => {
      await orm.runAndRevert(async () => {
        const { shop } = await setupTest();
        const customerUpdates = generate.user();

        const updatedShop = await shopRepo.update(shop.id, {
          customers: [customerUpdates],
        });

        expect(updatedShop.customers).toHaveLength(2);
        expect(updatedShop.customers.getItems()[1].user).toMatchObject({
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
      await orm.runAndRevert(async () => {
        const { shop } = await setupTest();
        const found = await shopRepo.findById(shop.id);

        expect(found).toMatchObject(shop);
      });
    });
  });

  describe('findByName', () => {
    test('should find a shop by name', async () => {
      await orm.runAndRevert(async () => {
        const { shop } = await setupTest();
        const found = await shopRepo.findByName(shop.name);

        expect(found).toMatchObject(shop);
      });
    });
  });

  describe('findProductById', () => {
    test('should find a shop by id', async () => {
      await orm.runAndRevert(async () => {
        const { shop } = await setupTest();
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
  const adminInput = generate.user();
  const customerInput = generate.user();

  const shop = await shopRepo.create({
    ...shopInput,
    admins: [adminInput],
    customers: [customerInput],
    products: [productInput1, productInput2],
  });

  return {
    shop,
    shopInput,
    productInput1,
    productInput2,
    adminInput,
    customerInput,
  };
}
