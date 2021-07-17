import { PrimaryKey, Property, DateType } from '@mikro-orm/core';
import { ObjectType, Field, ID } from 'type-graphql';

@ObjectType()
export class MutableEntity {
  @PrimaryKey()
  @Field(() => ID)
  id!: number;

  @Property({ type: DateType, nullable: false })
  createdAt = new Date();

  @Property({ type: DateType, onUpdate: () => new Date() })
  updatedAt = new Date();
}
