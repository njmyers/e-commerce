import { shopRepo } from './shop';
import { context } from '../../../lib/context';
import { generate } from '../../../../test/data';

describe('shopRepo', () => {
  afterAll(async () => {
    await context.close();
  });

  describe('create', () => {
    test('should create a shop', async () => {
      await context.runAndRevert(async () => {
        const input = generate.shop();
        const shop = await shopRepo.create(input);

        expect(shop).toMatchObject(input);
      });
    });
  });

  describe('findById', () => {
    test('should find a shop by id', async () => {
      await context.runAndRevert(async () => {
        const input = generate.shop();

        const shop = await shopRepo.create(input);
        const found = await shopRepo.findById(shop.id);

        expect(found).toMatchObject(shop);
      });
    });
  });

  describe('findByName', () => {
    test('should find a shop by name', async () => {
      await context.runAndRevert(async () => {
        const input = generate.shop();

        const shop = await shopRepo.create(input);
        const found = await shopRepo.findByName(shop.name);

        expect(found).toMatchObject(shop);
      });
    });
  });

  describe('update', () => {
    test('should update the shop description', async () => {
      await context.runAndRevert(async () => {
        const input = generate.shop();
        const updates = generate.shop();
        const shop = await shopRepo.create(input);

        const updated = await shopRepo.update(shop.id, {
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
