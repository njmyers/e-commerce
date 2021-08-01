import { Stripe } from 'stripe';

import { CheckoutSessionInput } from '../graphql';

import { orderRepo, productRepo } from '../repositories';

import { ApplicationError, ErrorCode, StatusCode } from '../lib/error';
import {
  createStripeCheckoutSession,
  StripeCheckoutSession,
} from '../services/stripe';

interface PaymentIntentArgs {
  input: CheckoutSessionInput;
  stripe: Stripe;
}

export async function createCheckoutSession({
  input,
  stripe,
}: PaymentIntentArgs): Promise<StripeCheckoutSession> {
  const lineItems = await Promise.all(
    input.lineItems.map(async lineItem => {
      const product = await productRepo.findById(lineItem.product.id);

      if (!product) {
        throw new ApplicationError('Cannot checkout with specified product', {
          code: ErrorCode.ERROR_NOT_FOUND,
          status: StatusCode.BadRequest,
        });
      }

      return {
        quantity: lineItem.quantity,
        product,
      };
    })
  );

  const order = orderRepo.create({ lineItems }, { persist: false });

  return await createStripeCheckoutSession({
    checkoutUrl: input.checkoutUrl,
    stripe,
    order,
  });
}
