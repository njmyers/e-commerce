import {
  PrimaryKey,
  Entity,
  Property,
  Collection,
  OneToMany,
} from '@mikro-orm/core';

import { Customer } from '../../billing/models';

export interface ShopInput {
  name: string;
  description: string;
}

@Entity()
export class Shop {
  @PrimaryKey()
  id!: number;

  @Property()
  name: string;

  @Property()
  description: string;

  @OneToMany(() => Customer, customer => customer.shop)
  customers = new Collection<Customer>(this);

  constructor(input: ShopInput) {
    this.name = input.name;
    this.description = input.description;
  }
}
