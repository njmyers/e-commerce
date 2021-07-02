import { Entity, Property, ManyToOne } from '@mikro-orm/core';
import { Field, ObjectType } from 'type-graphql';

import { Product } from '../../shop/models';
import { Order } from './order';
import { MutableEntity } from '../../../lib/entity';

export interface LineItemFields {
  quantity: number;
  product: Product;
}

@Entity()
@ObjectType()
export class LineItem extends MutableEntity {
  @Property()
  @Field()
  quantity: number;

  @ManyToOne({ nullable: false })
  @Field(() => Product)
  product: Product;

  @ManyToOne({ nullable: false })
  @Field(() => Order)
  order!: Order;

  constructor(input: LineItemFields) {
    super();
    this.quantity = input.quantity;
    this.product = input.product;
  }
}
