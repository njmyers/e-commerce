import path from 'path';
import { config } from './config';
import { Options } from '@mikro-orm/core';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';

import { Shop, Product, User, Admin, Merchant, Customer } from './domains/shop';
import { LineItem, Order } from './domains/billing';
import { Address } from './domains/shipping';

const mikroOrmConfig: Options = {
  metadataProvider: TsMorphMetadataProvider,
  type: config.get('db.type') as 'postgresql',
  dbName: config.get('db.name'),
  host: config.get('db.address'),
  port: config.get('db.port'),
  user: config.get('db.username'),
  password: config.get('db.password'),
  entities: [
    Shop,
    Product,
    User,
    Admin,
    Merchant,
    Customer,
    LineItem,
    Order,
    Address,
  ],
  migrations: {
    tableName: 'mikro_orm_migrations',
    path: path.resolve(__dirname, '../migrations'),
    pattern: /^[\w-]+\d+\.ts$/,
    transactional: true,
    allOrNothing: true,
    dropTables: true,
    safe: false,
    emit: 'ts',
  },
};

export default mikroOrmConfig;
