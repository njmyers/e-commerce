import { registerEnumType } from 'type-graphql';
import { Role } from '../lib';

registerEnumType(Role, {
  name: 'Role',
});

export const noop = {};
