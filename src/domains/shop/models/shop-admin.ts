import { Entity, Enum, ManyToOne } from '@mikro-orm/core';
import { Field, ObjectType } from 'type-graphql';

import { MutableEntity } from '../../../lib/entity';

import { Shop } from './shop';
import { User } from './user';

import { Role } from '../lib/permissions';

export interface ShopAdminConstructorInput {
  shop: Shop;
  user: User;
}

@Entity()
@ObjectType()
export class ShopAdmin extends MutableEntity {
  @Enum(() => Role)
  @Field(() => Role)
  role = Role.ShopAdmin;

  @ManyToOne(() => Shop)
  @Field(() => Shop)
  shop: Shop;

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;

  constructor(input: ShopAdminConstructorInput) {
    super();
    this.user = input.user;
    this.shop = input.shop;
  }
}
