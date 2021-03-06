import { PrimaryKey, Property, BeforeUpdate } from '@mikro-orm/core';
import { ObjectType, Field, ID } from 'type-graphql';

import { ApplicationError, ErrorCode, StatusCode } from '../lib/error';

@ObjectType()
export class ImmutableEntity {
  @PrimaryKey()
  @Field(() => ID)
  id!: number;

  @Property({ nullable: false })
  createdAt = new Date();

  @BeforeUpdate()
  never(): void {
    throw new ApplicationError('Immutable entities cannot be updated', {
      code: ErrorCode.ERROR_FORBIDDEN,
      status: StatusCode.Forbidden,
    });
  }
}
