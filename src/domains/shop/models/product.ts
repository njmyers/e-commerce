import { Entity, Property, ManyToOne } from '@mikro-orm/core';
import { ObjectType, Field } from 'type-graphql';

import { MutableEntity } from '../../../lib/entity';
import { Shop } from './shop';

import {
  ConnectionFactory,
  EdgeFactory,
  PageInfoFactory,
} from '../../../lib/graphql/connection';

export interface ProductFields {
  name: string;
  description: string;
  price: number;
}

@Entity()
@ObjectType()
export class Product extends MutableEntity {
  @Property()
  @Field()
  name: string;

  @Property()
  @Field()
  description: string;

  @Property()
  @Field()
  price: number;

  @ManyToOne()
  shop!: Shop;

  constructor(input: ProductFields) {
    super();

    this.name = input.name;
    this.description = input.description;
    this.price = input.price;
  }
}

@ObjectType()
export class ProductsEdge extends EdgeFactory(() => Product) {
  // Add your own properties
}

@ObjectType()
export class ProductsPageInfo extends PageInfoFactory() {
  // Add your own properties
}

@ObjectType()
export class ProductsConnection extends ConnectionFactory(
  ProductsEdge,
  ProductsPageInfo
) {
  // Add your own properties
}
