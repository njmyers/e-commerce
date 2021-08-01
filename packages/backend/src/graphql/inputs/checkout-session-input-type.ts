import { InputType, Field } from 'type-graphql';

import { LineItemInput } from './line-item-input-type';

@InputType({ description: 'Create a new stripe checkout session' })
export class CheckoutSessionInput {
  @Field(() => [LineItemInput])
  lineItems: LineItemInput[] = [];

  @Field()
  checkoutUrl!: string;
}
