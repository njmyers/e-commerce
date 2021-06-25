import { shopRepo } from './shop';
import { productRepo } from './product';
import { context } from '../../../lib/context';
import { generate } from '../../../../test/data';
import { Product, ProductFields } from '../models';

describe('productRepo', () => {
  afterAll(async () => {
    await context.close();
  });

  describe('create', () => {
    test('should create a product', async () => {
      await context.runAndRevert(async () => {
        const input = generate.product();
        const { product } = await setupTest(input);
        expect(product).toMatchObject(input);
      });
    });
  });

  describe('findById', () => {
    test('should find a product by id', async () => {
      await context.runAndRevert(async () => {
        const input = generate.product();
        const { product } = await setupTest(input);

        const found = await productRepo.findById(product.id);
        expect(found).toMatchObject(product);
      });
    });
  });

  describe('findByName', () => {
    test('should find a product by name', async () => {
      await context.runAndRevert(async () => {
        const input = generate.product();
        const { product } = await setupTest(input);

        const found = await productRepo.findByName(product.name);
        expect(found).toMatchObject(product);
      });
    });
  });

  describe('update', () => {
    test('should update the product description', async () => {
      await context.runAndRevert(async () => {
        const input = generate.product();
        const { product } = await setupTest(input);

        const updates = generate.product();
        const updated = await productRepo.update(product.id, {
          description: updates.description,
        });

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
  const product = await productRepo.create({
    ...input,
    shop,
  });

  return {
    product,
  };
}
