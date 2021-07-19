import {
  Entity,
  Property,
  Collection,
  OneToMany,
  ManyToMany,
} from '@mikro-orm/core';
import { ObjectType, Field } from 'type-graphql';

import { MutableEntity } from './mutable-entity';
import {
  EdgeFactory,
  ConnectionFactory,
  PageInfoFactory,
} from '../graphql/connection';

import { Product, ProductsConnection } from './product';
import { Customer, CustomerConnection } from './customer';
import { Merchant, MerchantConnection } from './merchant';

export interface ShopFields {
  name: string;
  description: string;
}

@Entity()
@ObjectType()
export class Shop extends MutableEntity {
  @Property()
  @Field()
  name: string;

  @Property()
  @Field()
  description: string;

  @ManyToMany(() => Customer)
  @Field(() => CustomerConnection)
  customers = new Collection<Customer>(this);

  @ManyToMany(() => Merchant)
  @Field(() => MerchantConnection)
  merchants = new Collection<Merchant>(this);

  @OneToMany(() => Product, product => product.shop)
  @Field(() => ProductsConnection)
  products = new Collection<Product>(this);

  constructor(input: ShopFields) {
    super();
    this.name = input.name;
    this.description = input.description;
  }
}

@ObjectType()
export class ShopsEdge extends EdgeFactory(() => Shop) {
  // Add your own properties
}

@ObjectType()
export class ShopsPageInfo extends PageInfoFactory() {
  // Add your own properties
}

@ObjectType()
export class ShopsConnection extends ConnectionFactory(
  ShopsEdge,
  ShopsPageInfo
) {
  // Add your own properties
}
