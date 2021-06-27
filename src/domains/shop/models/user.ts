import { Entity, Property, Unique } from '@mikro-orm/core';
import { ObjectType, Field } from 'type-graphql';

import { MutableEntity } from '../../../lib/entity';
import { password } from '../lib/password';

export interface UserFields {
  email: string;
  name: string;
}

@Entity()
@ObjectType()
export class User extends MutableEntity {
  @Property()
  @Unique()
  @Field()
  email: string;

  @Property()
  @Field()
  name: string;

  @Property()
  password?: string;

  constructor(input: UserFields) {
    super();

    this.email = input.email;
    this.name = input.name;
  }

  async setPassword(clearText: string): Promise<void> {
    this.password = await password.hash(clearText);
  }
}
