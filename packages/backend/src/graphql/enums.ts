import { registerEnumType } from 'type-graphql';
import { Role } from '../lib/permissions';

registerEnumType(Role, {
  name: 'Role',
});

export const noop = {};
