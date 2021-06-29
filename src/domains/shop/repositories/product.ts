import { orm } from '../../../lib/context';
import { Product, ProductFields, Shop } from '../models';
import { ApplicationError, StatusCode, ErrorCode } from '../../../lib/error';

interface ProductInput extends ProductFields {
  shop: Shop;
}

async function findById(id: number): Promise<Product | null> {
  return await orm.em.findOne(Product, { id });
}

async function findByName(name: string): Promise<Product | null> {
  return await orm.em.findOne(Product, {
    name,
  });
}

function create(input: ProductInput): Product {
  const product = new Product(input);
  product.shop = input.shop;

  orm.em.persist(product);

  return product;
}

async function update(
  id: number,
  input: Partial<ProductInput>
): Promise<Product> {
  const product = await orm.em.findOne(Product, id);

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

  return product;
}

export const productRepo = {
  findById,
  findByName,
  create,
  update,
};
