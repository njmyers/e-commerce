import { Entity, Enum, Property } from '@mikro-orm/core';
import { ObjectType, Field } from 'type-graphql';

import { ImmutableEntity } from './immutable-entity';
import { Country } from './country';

export interface AddressFields {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  province?: string;
  postalCode: string;
  country: Country;
}

@Entity()
@ObjectType()
export class Address extends ImmutableEntity {
  @Property()
  @Field()
  addressLine1: string;

  @Property()
  @Field()
  addressLine2?: string;

  @Property()
  @Field()
  city: string;

  @Property()
  @Field()
  province?: string;

  @Property()
  @Field()
  postalCode: string;

  @Enum(() => Country)
  @Field(() => Country)
  country: string;

  constructor(input: AddressFields) {
    super();

    this.addressLine1 = input.addressLine1;
    this.addressLine2 = input.addressLine2;
    this.city = input.city;
    this.province = input.province;
    this.postalCode = input.postalCode;
    this.country = input.country;
  }
}
