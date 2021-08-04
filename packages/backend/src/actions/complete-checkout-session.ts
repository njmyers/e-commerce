import {
  AddressFields,
  LineItemFields,
  CustomerFields,
  Order,
} from '../models';
import { orderRepo, userRepo } from '../repositories';
import { Role } from '../lib/permissions';
import { orm } from '../lib/orm';

export interface CompleteCheckoutSessionArgs {
  shippingAddress: AddressFields;
  billingAddress: AddressFields;
  lineItems: LineItemFields[];
  customer: CustomerFields;
}

export async function completeCheckoutSession(
  input: CompleteCheckoutSessionArgs
): Promise<Order> {
  const existingCustomer = await userRepo.findByEmail({
    email: input.customer.email,
    role: Role.Customer,
  });

  const customer = existingCustomer
    ? existingCustomer
    : await userRepo.create(Role.Customer, input.customer);

  const order = orderRepo.create({
    lineItems: input.lineItems,
    customer,
    shippingAddress: input.shippingAddress,
    billingAddress: input.billingAddress,
  });

  await orm.em.flush();

  return order;
}
