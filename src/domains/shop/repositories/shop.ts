import { context } from '../../../lib/context';
import { Shop, ShopInput } from '../models';
import { ApplicationError, StatusCode, ErrorCode } from '../../../lib/error';

async function findById(id: number): Promise<Shop | null> {
  return await context.em.findOne(Shop, { id });
}

async function findByName(name: string): Promise<Shop | null> {
  return await context.em.findOne(Shop, {
    name,
  });
}

async function create(input: ShopInput): Promise<Shop> {
  const shop = new Shop(input);

  context.em.persist(shop);
  await context.em.flush();

  return shop;
}

async function update(id: number, input: Partial<ShopInput>): Promise<Shop> {
  const shop = await context.em.findOne(Shop, id);

  if (!shop) {
    throw new ApplicationError('Cannot find shop with id', {
      status: StatusCode.NotFound,
      code: ErrorCode.ERROR_NOT_FOUND,
      data: {
        id,
      },
    });
  }

  Object.entries(input).forEach(([field, value]) => {
    if (value) {
      shop[field] = value;
    }
  });

  await context.em.flush();

  return shop;
}

export const shopRepo = {
  findById,
  findByName,
  create,
  update,
};
