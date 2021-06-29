import { shopRepo } from './shop';
import { productRepo } from './product';
import { orm } from '../../../lib/context';
import { generate } from '../../../../test/data';
import { Product, ProductFields } from '../models';

describe('productRepo', () => {
  afterAll(async () => {
    await orm.close();
  });

  describe('create', () => {
    test('should create a product', async () => {
      await orm.runAndRevert(async em => {
        const input = generate.product();
        const { product } = await setupTest(input);
        await em.flush();

        expect(product).toMatchObject(input);
      });
    });
  });

  describe('findById', () => {
    test('should find a product by id', async () => {
      await orm.runAndRevert(async em => {
        const input = generate.product();
        const { product } = await setupTest(input);
        await em.flush();

        const found = await productRepo.findById(product.id);
        expect(found).toMatchObject(product);
      });
    });
  });

  describe('findByName', () => {
    test('should find a product by name', async () => {
      await orm.runAndRevert(async em => {
        const input = generate.product();
        const { product } = await setupTest(input);
        await em.flush();

        const found = await productRepo.findByName(product.name);
        expect(found).toMatchObject(product);
      });
    });
  });

  describe('update', () => {
    test('should update the product description', async () => {
      await orm.runAndRevert(async em => {
        const input = generate.product();
        const { product } = await setupTest(input);
        await em.flush();

        const updates = generate.product();
        const updated = await productRepo.update(product.id, {
          description: updates.description,
        });

        await em.flush();

        expect(updated).toMatchObject({
          name: input.name,
          description: updates.description,
        });
      });
    });
  });
});

interface SetupTestReturn {
  product: Product;
}

async function setupTest(input: ProductFields): Promise<SetupTestReturn> {
  const shop = await shopRepo.create(generate.shop());
  const product = productRepo.create({
    ...input,
    shop,
  });

  return {
    product,
  };
}
