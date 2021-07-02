import { v1 as uuid } from 'uuid';
import {
  Entity,
  Property,
  DateType,
  ManyToOne,
  OneToMany,
  Collection,
  Unique,
} from '@mikro-orm/core';
import { Field, ObjectType } from 'type-graphql';

import { LineItem } from './line-item';
import { Customer } from '../../shop/models';
import { MutableEntity } from '../../../lib/entity';

export interface OrderFields {
  tax: number;
  notes?: string;
  shippedAt?: Date;
}

@Entity()
@ObjectType()
export class Order extends MutableEntity {
  @Property()
  @Unique()
  @Field()
  number: string;

  @Property()
  @Field()
  get total(): number {
    if (!this.lineItems) {
      return 0;
    }

    const lineItems = Array.from(this.lineItems);

    return lineItems.reduce((sum: number, lineItem: LineItem) => {
      return sum + lineItem.product.price * lineItem.quantity;
    }, 0);
  }

  @Property()
  @Field()
  tax: number;

  @Property()
  @Field()
  notes?: string;

  @Property({ type: DateType })
  @Field()
  shippedAt?: Date;

  @ManyToOne()
  @Field(() => Customer)
  customer!: Customer;

  @OneToMany(() => LineItem, lineItem => lineItem.order)
  @Field(() => [LineItem])
  lineItems = new Collection<LineItem>(this);

  constructor(input: OrderFields) {
    super();
    this.number = uuid().replace(/-/gi, '').slice(0, 16);

    this.tax = input.tax;
    this.shippedAt = input.shippedAt;
    this.notes = input.notes;
  }
}
