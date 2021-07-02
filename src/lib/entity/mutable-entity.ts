import { PrimaryKey, Property, DateType } from '@mikro-orm/core';
import { Field, ID } from 'type-graphql';

export class MutableEntity {
  @PrimaryKey()
  @Field(() => ID)
  id!: number;

  @Property({ type: DateType, nullable: false })
  createdAt = new Date();

  @Property({ type: DateType, onUpdate: () => new Date() })
  updatedAt = new Date();
}
