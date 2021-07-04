import { Entity } from '@mikro-orm/core';
import { ObjectType } from 'type-graphql';

import { Role } from '../lib';
import { User, UserFields } from './user';
import {
  ConnectionFactory,
  EdgeFactory,
  PageInfoFactory,
} from '../../../lib/graphql/connection';

export type CustomerFields = Omit<UserFields, 'role'>;

@Entity()
@ObjectType()
export class Customer extends User {
  constructor(input: CustomerFields) {
    super({ ...input, role: Role.Customer });
  }
}

@ObjectType()
export class CustomerEdge extends EdgeFactory(() => Customer) {
  // Add your own properties
}

@ObjectType()
export class CustomerPageInfo extends PageInfoFactory() {
  // Add your own properties
}

@ObjectType()
export class CustomerConnection extends ConnectionFactory(
  CustomerEdge,
  CustomerPageInfo
) {
  // Add your own properties
}
