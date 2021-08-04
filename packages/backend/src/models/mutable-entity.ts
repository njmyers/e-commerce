import { PrimaryKey, Property } from '@mikro-orm/core';
import { ObjectType, Field, ID } from 'type-graphql';

@ObjectType()
export class MutableEntity {
  @PrimaryKey()
  @Field(() => ID)
  id!: number;

  @Property({ nullable: false })
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();
}
