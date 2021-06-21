import { Country } from './Country';

export interface Address {
  name: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  province?: string;
  postalCode: string;
  country: Country;
}
