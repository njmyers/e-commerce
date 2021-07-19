import { Entity, OneToMany, Collection } from '@mikro-orm/core';
import { ObjectType, Field } from 'type-graphql';

import { Role } from '../lib';
import { User, UserFields } from './user';
import {
  ConnectionFactory,
  EdgeFactory,
  PageInfoFactory,
} from '../graphql/connection';
import { Order, OrderConnection } from './order';

export type CustomerFields = Omit<UserFields, 'role'>;

@Entity()
@ObjectType()
export class Customer extends User {
  @OneToMany(() => Order, order => order.customer)
  @Field(() => OrderConnection)
  orders = new Collection<Order>(this);

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
