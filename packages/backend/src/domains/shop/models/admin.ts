import { Entity } from '@mikro-orm/core';
import { ObjectType } from 'type-graphql';

import { Role } from '../lib';
import { User, UserFields } from './user';
import {
  ConnectionFactory,
  EdgeFactory,
  PageInfoFactory,
} from '../../../lib/graphql/connection';

export type AdminFields = Omit<UserFields, 'role'>;

@Entity()
@ObjectType()
export class Admin extends User {
  constructor(input: AdminFields) {
    super({ ...input, role: Role.Admin });
  }
}

@ObjectType()
export class AdminEdge extends EdgeFactory(() => Admin) {
  // Add your own properties
}

@ObjectType()
export class AdminPageInfo extends PageInfoFactory() {
  // Add your own properties
}

@ObjectType()
export class AdminConnection extends ConnectionFactory(
  AdminEdge,
  AdminPageInfo
) {
  // Add your own properties
}
