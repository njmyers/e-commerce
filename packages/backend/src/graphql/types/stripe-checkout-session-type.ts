import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class StripeCheckoutSession {
  @Field()
  url!: string;
}
