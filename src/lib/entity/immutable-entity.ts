import { PrimaryKey, Property, DateType, BeforeUpdate } from '@mikro-orm/core';
import { Field, ID } from 'type-graphql';

import { ApplicationError, ErrorCode, StatusCode } from '../error';

export class ImmutableEntity {
  @PrimaryKey()
  @Field(() => ID)
  id!: number;

  @Property({ type: DateType, nullable: false })
  createdAt = new Date();

  @BeforeUpdate()
  never(): void {
    throw new ApplicationError('Immutable entities cannot be updated', {
      code: ErrorCode.ERROR_FORBIDDEN,
      status: StatusCode.Forbidden,
    });
  }
}
