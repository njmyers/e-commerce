/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  PasswordField,
  UserFields,
  AddressFields,
  OrderFields,
  ProductFields,
  Country,
} from '../src/models';
import fakerLocaleEnUs from 'faker/locale/en_US';

fakerLocaleEnUs.seed(0o7734);
export const faker = fakerLocaleEnUs;

function shop() {
  return {
    name: faker.random.word(),
    description: faker.random.words(),
  };
}

function user(user?: Partial<UserFields & PasswordField>) {
  return {
    email: faker.internet.email(),
    name: faker.name.findName(),
    password: faker.internet.password(),
    ...user,
  };
}

function order(): OrderFields {
  return {
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

function product(): ProductFields {
  return {
    name: faker.random.word(),
    description: faker.random.words(),
    price: faker.datatype.number({ min: 1000, max: 10000 }),
    length: faker.datatype.number({ min: 1000, max: 10000 }),
    height: faker.datatype.number({ min: 1000, max: 10000 }),
    width: faker.datatype.number({ min: 1000, max: 10000 }),
    mass: faker.datatype.number({ min: 1000, max: 10000 }),
  };
}

function address(): AddressFields {
  const province = faker.address.stateAbbr();

  return {
    addressLine1: faker.address.streetAddress(),
    city: faker.address.city(),
    province,
    postalCode: faker.address.zipCodeByState(province),
    country: Country.US,
  };
}

export const generate = {
  shop,
  user,
  order,
  lineItem,
  product,
  address,
};
