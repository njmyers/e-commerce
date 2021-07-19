import { Entity } from '@mikro-orm/core';
import { ObjectType } from 'type-graphql';

import { Role } from '../lib';
import { User, UserFields } from './user';
import {
  ConnectionFactory,
  EdgeFactory,
  PageInfoFactory,
} from '../graphql/connection';

export type MerchantFields = Omit<UserFields, 'role'>;

@Entity()
@ObjectType()
export class Merchant extends User {
  constructor(input: MerchantFields) {
    super({ ...input, role: Role.Merchant });
  }
}

@ObjectType()
export class MerchantEdge extends EdgeFactory(() => Merchant) {
  // Add your own properties
}

@ObjectType()
export class MerchantPageInfo extends PageInfoFactory() {
  // Add your own properties
}

@ObjectType()
export class MerchantConnection extends ConnectionFactory(
  MerchantEdge,
  MerchantPageInfo
) {
  // Add your own properties
}
