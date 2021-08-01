import { Entity, Property, ManyToOne } from '@mikro-orm/core';
import { ObjectType, Field, Int } from 'type-graphql';

import { MutableEntity } from './mutable-entity';
import { Shop } from './shop';

import {
  ConnectionFactory,
  EdgeFactory,
  PageInfoFactory,
} from '../graphql/connection';

export interface ProductFields {
  name: string;
  description: string;
  price: number;
  length: number;
  height: number;
  width: number;
  mass: number;
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
  @Field(() => Int)
  price: number;

  @Property()
  @Field(() => Int)
  length: number;

  @Property()
  @Field(() => Int)
  height: number;

  @Property()
  @Field(() => Int)
  width: number;

  @Property()
  @Field(() => Int)
  mass: number;

  @ManyToOne()
  shop!: Shop;

  constructor(input: ProductFields) {
    super();

    this.name = input.name;
    this.description = input.description;
    this.price = input.price;
    this.length = input.length;
    this.height = input.height;
    this.width = input.width;
    this.mass = input.mass;
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
