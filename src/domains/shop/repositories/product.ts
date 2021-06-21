import { context } from '../../../lib/context';
import { Product, ProductInput } from '../models';
import { ApplicationError, StatusCode, ErrorCode } from '../../../lib/error';

async function findById(id: number): Promise<Product | null> {
  return await context.em.findOne(Product, { id });
}

async function findByName(name: string): Promise<Product | null> {
  return await context.em.findOne(Product, {
    name,
  });
}

async function create(input: ProductInput): Promise<Product> {
  const product = new Product(input);

  context.em.persist(product);
  await context.em.flush();

  return product;
}

async function update(
  id: number,
  input: Partial<ProductInput>
): Promise<Product> {
  const product = await context.em.findOne(Product, id);

  if (!product) {
    throw new ApplicationError('Cannot find product with id', {
      status: StatusCode.NotFound,
      code: ErrorCode.ERROR_NOT_FOUND,
      data: {
        id,
      },
    });
  }

  Object.entries(input).forEach(([field, value]) => {
    if (value) {
      product[field] = value;
    }
  });

  await context.em.flush();

  return product;
}

export const productRepo = {
  findById,
  findByName,
  create,
  update,
};
