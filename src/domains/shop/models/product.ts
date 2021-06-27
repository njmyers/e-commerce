import { Entity, Property, ManyToOne } from '@mikro-orm/core';
import { ObjectType, Field } from 'type-graphql';

import { MutableEntity } from '../../../lib/entity';
import { Shop } from './shop';

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
