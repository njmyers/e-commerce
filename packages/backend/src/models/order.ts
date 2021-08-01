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
import { Field, ObjectType, Int } from 'type-graphql';

import { LineItem } from './line-item';
import { User } from './user';
import { MutableEntity } from './mutable-entity';
import {
  ConnectionFactory,
  EdgeFactory,
  PageInfoFactory,
} from '../graphql/connection';
export interface OrderFields {
  tax?: number;
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
  @Field(() => Int)
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
  @Field(() => Int)
  tax?: number;

  @Property()
  @Field()
  notes?: string;

  @Property({ type: DateType })
  @Field()
  shippedAt?: Date;

  @ManyToOne()
  customer!: User;

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

@ObjectType()
export class OrderEdge extends EdgeFactory(() => Order) {
  // Add your own properties
}

@ObjectType()
export class OrderPageInfo extends PageInfoFactory() {
  // Add your own properties
}

@ObjectType()
export class OrderConnection extends ConnectionFactory(
  OrderEdge,
  OrderPageInfo
) {
  // Add your own properties
}
