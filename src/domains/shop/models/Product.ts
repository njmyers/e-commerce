import { PrimaryKey, Entity, Property, ManyToOne } from '@mikro-orm/core';
import { MutableEntity } from '../../../lib/entity';
import { Shop } from './Shop';

export interface ProductFields {
  name: string;
  description: string;
  price: number;
}

export interface ProductInput extends ProductFields {
  shop: Shop;
}

@Entity()
export class Product extends MutableEntity {
  @PrimaryKey()
  id!: number;

  @Property()
  name: string;

  @Property()
  description: string;

  @Property()
  price: number;

  @ManyToOne()
  shop!: Shop;

  constructor(input: ProductInput) {
    super();
    this.name = input.name;
    this.description = input.description;
    this.price = input.price;

    this.shop = input.shop;
  }
}
