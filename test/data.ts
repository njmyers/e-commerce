/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import faker from 'faker/locale/en_US';

faker.seed(0o7734);

function shop() {
  return {
    name: faker.random.word(),
    description: faker.random.words(),
  };
}

function customer() {
  return {
    email: faker.internet.email(),
    name: faker.name.findName(),
  };
}

function order() {
  return {
    total: faker.datatype.number({ min: 0, max: 10000 }),
    tax: faker.datatype.number({ min: 0, max: 10000 }),
    notes: faker.random.words(),
    shippedAt: faker.date.future(),
  };
}

function lineItem() {
  return {
    quantity: faker.datatype.number({ min: 0, max: 10 }),
  };
}

function product() {
  return {
    name: faker.random.word(),
    description: faker.random.words(),
    price: faker.datatype.number({ min: 1000, max: 10000 }),
  };
}

export const generate = {
  shop,
  customer,
  order,
  lineItem,
  product,
};
