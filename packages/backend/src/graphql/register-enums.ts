import { registerEnumType } from 'type-graphql';
import { Role } from '../lib/permissions';
import { Country } from '../models/country';

export function registerEnums(): void {
  registerEnumType(Role, {
    name: 'Role',
  });

  registerEnumType(Country, {
    name: 'Country',
  });
}
