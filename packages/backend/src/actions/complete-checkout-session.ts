import { Stripe } from 'stripe';

import { PaymentIntentInput } from '../graphql';
import { Customer } from '../models';

import { userRepo, orderRepo, productRepo } from '../repositories';

import { Role } from '../lib/permissions';
import { orm } from '../lib/orm';
import { ApplicationError, ErrorCode, StatusCode } from '../lib/error';
import { createCheckoutSession } from '../services/stripe';

interface PaymentIntentArgs {
  input: PaymentIntentInput;
  stripe: Stripe;
}

export async function createPaymentIntent({
  input,
  stripe,
}: PaymentIntentArgs): Promise<Customer> {
  const existingCustomer = await userRepo.findByEmail({
    role: Role.Customer,
    email: input.user.email,
  });

  const customer = existingCustomer
    ? existingCustomer
    : await userRepo.create(Role.Customer, input.user);

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
  const stripeCheckoutSession = await createCheckoutSession({
    stripe,
    order,
    customer,
  });

  orm.em.persist(customer);
  await orm.em.flush();

  return customer;
}
