import { Resolver, Arg, Mutation, Ctx } from 'type-graphql';

import { orm } from '../../lib/orm';

import { createCheckoutSession } from '../../actions/create-checkout-session';
import { CheckoutSessionInput } from '../inputs';
import { ShopGraphQLContext } from '../context';
import { StripeCheckoutSession } from '../types';

@Resolver(() => StripeCheckoutSession)
export class CheckoutSessionResolver {
  @Mutation(() => StripeCheckoutSession)
  async createCheckoutSession(
    @Arg('input') input: CheckoutSessionInput,
    @Ctx() ctx: ShopGraphQLContext
  ): Promise<StripeCheckoutSession> {
    return await orm.run(async () => {
      const session = await createCheckoutSession({
        input,
        stripe: ctx.stripe,
      });

      if (!session.url) {
        throw new Error('Cannot create stripe session');
      }

      return {
        url: session.url,
      };
    });
  }
}
