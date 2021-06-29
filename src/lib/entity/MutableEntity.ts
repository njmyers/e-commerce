import { PrimaryKey, Property, DateType } from '@mikro-orm/core';
export class MutableEntity {
  @PrimaryKey()
  id!: number;

  @Property({ type: DateType, onUpdate: () => new Date() })
  updatedAt = new Date();

  @Property({ type: DateType })
  createdAt = new Date();
}
