import { PrimaryKey, Entity, Property, ManyToOne } from '@mikro-orm/core';
import { Shop } from './Shop';

export interface ProductInput {
  name: string;
  description: string;
  shop: Shop;
}

@Entity()
export class Product {
  @PrimaryKey()
  id!: number;

  @Property()
  name: string;

  @Property()
  description: string;

  @ManyToOne()
  shop!: Shop;

  constructor(input: ProductInput) {
    this.name = input.name;
    this.description = input.description;
    this.shop = input.shop;
  }
}
