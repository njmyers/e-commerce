/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import path from 'path';
// @ts-expect-error Not typed yet
import config from '@inscripted/config';
import { Options } from '@mikro-orm/core';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';

import { Shop, Product } from './domains/shop/models';
import { Customer, Order, LineItem } from './domains/billing/models';

const mikroOrmConfig: Options = {
  metadataProvider: TsMorphMetadataProvider,
  type: config.get('db.type') as 'sqlite',
  dbName: config.get('db.name') as string,
  host: config.get('db.address') as string,
  port: config.get('db.port') as number,
  user: config.get('db.username') as string,
  password: config.get('db.password') as string,
  entities: [Shop, Product, Customer, Order, LineItem],
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
