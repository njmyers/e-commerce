import { Entity, Property, ManyToOne } from '@mikro-orm/core';
import { Field, ObjectType, Int } from 'type-graphql';

import { Product } from './product';
import { Order } from './order';
import { MutableEntity } from './mutable-entity';

export interface LineItemFields {
  quantity: number;
  product: Product;
}

@Entity()
@ObjectType()
export class LineItem extends MutableEntity {
  @Property()
  @Field(() => Int)
  quantity: number;

  @ManyToOne({ nullable: false })
  @Field(() => Product)
  product: Product;

  @ManyToOne({ nullable: false })
  order!: Order;

  constructor(input: LineItemFields) {
    super();
    this.quantity = input.quantity;
    this.product = input.product;
  }
}
