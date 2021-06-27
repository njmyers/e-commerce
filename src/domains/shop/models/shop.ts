import {
  PrimaryKey,
  Entity,
  Property,
  Collection,
  OneToMany,
} from '@mikro-orm/core';
import { ObjectType, Field } from 'type-graphql';

import { ShopCustomer } from './shop-customer';
import { ShopAdmin } from './shop-admin';
import { Product } from './product';

export interface ShopFields {
  name: string;
  description: string;
}

@Entity()
@ObjectType()
export class Shop {
  @PrimaryKey()
  id!: number;

  @Property()
  @Field()
  name: string;

  @Property()
  @Field()
  description: string;

  @OneToMany(() => ShopAdmin, admin => admin.shop)
  @Field(() => [ShopAdmin])
  admins = new Collection<ShopAdmin>(this);

  @OneToMany(() => ShopCustomer, customer => customer.shop)
  @Field(() => [ShopCustomer])
  customers = new Collection<ShopCustomer>(this);

  @OneToMany(() => Product, product => product.shop)
  @Field(() => [Product])
  products = new Collection<Product>(this);

  constructor(input: ShopFields) {
    this.name = input.name;
    this.description = input.description;
  }
}
