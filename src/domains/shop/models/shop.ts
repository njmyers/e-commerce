import {
  Entity,
  Property,
  Collection,
  OneToMany,
  ManyToMany,
} from '@mikro-orm/core';
import { ObjectType, Field } from 'type-graphql';

import { MutableEntity } from '../../../lib/entity';
import { Product } from './product';
import { Customer, Merchant } from './user';

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
  @Field(() => Customer)
  customers = new Collection<Customer>(this);

  @ManyToMany(() => Merchant)
  @Field(() => Merchant)
  merchants = new Collection<Merchant>(this);

  @OneToMany(() => Product, product => product.shop)
  @Field(() => [Product])
  products = new Collection<Product>(this);

  constructor(input: ShopFields) {
    super();
    this.name = input.name;
    this.description = input.description;
  }
}
