import { PrimaryKey, Property, DateType, BeforeUpdate } from '@mikro-orm/core';
import { ApplicationError, ErrorCode, StatusCode } from '../error';

export class ImmutableEntity {
  @PrimaryKey()
  id!: number;

  @Property({ type: DateType, nullable: false })
  createdAt = new Date();

  @BeforeUpdate()
  preventUpdate(): void {
    throw new ApplicationError('Immutable entities cannot be updated', {
      code: ErrorCode.ERROR_FORBIDDEN,
      status: StatusCode.Forbidden,
    });
  }
}
