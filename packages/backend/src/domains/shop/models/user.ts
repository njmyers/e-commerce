import { Entity, Property, Unique, Enum } from '@mikro-orm/core';
import { Field, ObjectType } from 'type-graphql';

import { MutableEntity } from '../../../lib/entity';
import { Role } from '../lib';
import { password } from '../lib/password';

const discriminatorMap = {
  [Role.Admin]: 'Admin',
  [Role.Merchant]: 'Merchant',
  [Role.Customer]: 'Customer',
};

export interface UserFields {
  email: string;
  name: string;
  role: Role;
}

export interface PasswordField {
  password?: string;
}

@Entity({ discriminatorColumn: 'role', discriminatorMap })
@ObjectType()
export class User extends MutableEntity {
  @Property()
  @Unique()
  @Field()
  email: string;

  @Property()
  @Field()
  name: string;

  @Enum(() => Role)
  @Field(() => Role)
  role: Role;

  @Property()
  password?: string;

  constructor(input: UserFields) {
    super();
    this.email = input.email;
    this.name = input.name;
    this.role = input.role;
  }

  async setPassword(clearText: string): Promise<void> {
    this.password = await password.hash(clearText);
  }
}
