import { InputType, Field } from 'type-graphql';
import { Country } from '../../models';

@InputType()
export class AddressInput {
  @Field()
  addressLine1!: string;

  @Field()
  addressLine2?: string;

  @Field()
  city!: string;

  @Field()
  province?: string;

  @Field()
  postalCode!: string;

  @Field(() => Country)
  country!: Country;
}
