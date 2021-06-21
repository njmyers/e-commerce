import { shopRepo } from './shop';
import { productRepo } from './product';
import { context } from '../../../lib/context';
import { generate } from '../../../../test/data';
import { Shop } from '../models';

describe('productRepo', () => {
  let shop: Shop;

  beforeAll(async () => {
    await context.run(async () => {
      shop = await shopRepo.create(generate.shop());
    });
  });

  afterAll(async () => {
    await context.run(async () => {
      await context.em.removeAndFlush(shop);
    });

    await context.close();
  });

  describe('create', () => {
    test('should create a shop', async () => {
      await context.runAndRevert(async () => {
        const input = generate.product();
        const product = await productRepo.create({
          ...input,
          shop,
        });

        expect(product).toMatchObject(input);
      });
    });
  });

  describe('findById', () => {
    test('should find a shop by id', async () => {
      await context.runAndRevert(async () => {
        const input = generate.product();
        const product = await productRepo.create({
          ...input,
          shop,
        });

        const found = await productRepo.findById(product.id);
        expect(found).toMatchObject(product);
      });
    });
  });

  describe('findByName', () => {
    test('should find a shop by name', async () => {
      await context.runAndRevert(async () => {
        const input = generate.product();
        const product = await productRepo.create({
          ...input,
          shop,
        });

        const found = await productRepo.findByName(product.name);
        expect(found).toMatchObject(product);
      });
    });
  });

  describe('update', () => {
    test('should update the shop email', async () => {
      await context.runAndRevert(async () => {
        const input = generate.product();
        const updates = generate.product();

        const product = await productRepo.create({
          ...input,
          shop,
        });

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
