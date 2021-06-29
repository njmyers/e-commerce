import { orm } from '../../../lib/context';
import {
  Shop,
  ShopFields,
  Product,
  ProductFields,
  Customer,
  CustomerFields,
  Merchant,
  MerchantFields,
  PasswordField,
} from '../models';
import { ApplicationError, StatusCode, ErrorCode } from '../../../lib/error';
import { userRepo } from './user';
import { Role } from '../lib';

type ProductInput = Product | ProductFields;
type CustomerInput = Customer | (CustomerFields & PasswordField);
type MerchantInput = Merchant | (MerchantFields & PasswordField);
export interface ShopInput extends ShopFields {
  merchants?: MerchantInput[];
  customers?: CustomerInput[];
  products?: ProductInput[];
}

async function findById(id: number): Promise<Shop | null> {
  return await orm.em.findOne(Shop, { id });
}

async function findByName(name: string): Promise<Shop | null> {
  return await orm.em.findOne(Shop, {
    name,
  });
}

async function findProductById(id: number): Promise<Product | null> {
  return await orm.em.findOne(Product, {
    id,
  });
}

async function findProductByName(name: string): Promise<Product | null> {
  return await orm.em.findOne(Product, {
    name,
  });
}

async function create(input: ShopInput): Promise<Shop> {
  const shop = new Shop(input);
  await addRelationsToShop(shop, input);

  orm.em.persist(shop);
  await orm.em.flush();
  return shop;
}

async function update(id: number, input: Partial<ShopInput>): Promise<Shop> {
  const shop = await orm.em.findOne(Shop, id);

  if (!shop) {
    throw new ApplicationError('Cannot find shop with id', {
      status: StatusCode.NotFound,
      code: ErrorCode.ERROR_NOT_FOUND,
      data: {
        id,
      },
    });
  }

  const fields = {
    name: input.name,
    description: input.description,
  };

  Object.entries(fields).forEach(([field, value]) => {
    if (value) {
      shop[field] = value;
    }
  });

  await addRelationsToShop(shop, input);

  await orm.em.flush();
  return shop;
}

async function addRelationsToShop(shop: Shop, input: Partial<ShopInput>) {
  if (Array.isArray(input.merchants)) {
    await Promise.all(
      input.merchants.map(async admin => {
        await upsertMerchantToShop(shop, admin);
      })
    );
  }

  if (Array.isArray(input.customers)) {
    await Promise.all(
      input.customers.map(async customer => {
        await upsertCustomerToShop(shop, customer);
      })
    );
  }

  if (Array.isArray(input.products)) {
    input.products.forEach(product => {
      addProductToShop(shop, product);
    });
  }
}

function addProductToShop(shop: Shop, input: ProductInput) {
  const product = input instanceof Product ? input : new Product(input);
  shop.products.add(product);
}

async function upsertMerchantToShop(shop: Shop, input: MerchantInput) {
  const merchant =
    input instanceof Merchant
      ? input
      : await userRepo.create(Role.Merchant, input);

  shop.merchants.add(merchant);
}

async function upsertCustomerToShop(shop: Shop, input: CustomerInput) {
  const customer =
    input instanceof Customer
      ? input
      : await userRepo.create(Role.Customer, input);

  shop.customers.add(customer);
}

export const shopRepo = {
  findById,
  findByName,
  findProductById,
  findProductByName,
  create,
  update,
};
