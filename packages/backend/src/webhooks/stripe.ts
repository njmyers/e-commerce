import { FastifyInstance, FastifyReply } from 'fastify';
import { Stripe } from 'stripe';

import { completeCheckoutSession } from '../actions/complete-checkout-session';
import { AddressFields, Country } from '../models';
import { MetadataLineItem } from '../services/stripe';

import { ApplicationError, ErrorCode, StatusCode } from '../lib/error';
import { orm } from '../lib/orm';
import { logger } from '../lib/logger';
import * as json from '../lib/json';

import { productRepo } from '../repositories';

export type StripeLineItem = Stripe.Checkout.SessionCreateParams.LineItem;

export interface StripeRequest {
  Body: Stripe.Event;
}

export enum StripeEvent {
  CheckoutSessionCompleted = 'checkout.session.completed',
}

// eslint-disable-next-line @typescript-eslint/require-await
export async function stripe(app: FastifyInstance): Promise<void> {
  app.post<StripeRequest>('/webhooks/stripe', async (request, reply) => {
    await orm.run(async () => {
      const event: Stripe.Event = request.body;

      try {
        switch (event.type) {
          case StripeEvent.CheckoutSessionCompleted: {
            await handleCheckoutSessionCompleted(event);
            return await handleReply(reply, StatusCode.Success);
          }

          default: {
            return await handleReply(reply, StatusCode.Success);
          }
        }
      } catch (caughtError: unknown) {
        const error =
          caughtError instanceof ApplicationError
            ? caughtError
            : new ApplicationError('Unknown error', {
                status: StatusCode.BadRequest,
                code: ErrorCode.ERROR_INTERNAL,
                data: {
                  caughtError,
                },
              });

        logger.error('Stripe webhook event failed', { error });

        return await handleReply(reply, error.status);
      }
    });
  });
}

export async function handleCheckoutSessionCompleted(
  event: Stripe.Event
): Promise<void> {
  const data = event.data.object as Stripe.Checkout.Session;

  if (!data.shipping?.name) {
    throw new ApplicationError('Missing required stripe customer name', {
      code: ErrorCode.ERROR_NOT_FOUND,
      status: StatusCode.NotFound,
      data: {
        param: 'shipping.name',
      },
    });
  }

  if (!data.customer_details?.email) {
    throw new ApplicationError('Missing required stripe customer email', {
      code: ErrorCode.ERROR_NOT_FOUND,
      status: StatusCode.NotFound,
      data: {
        param: 'customer_details.email',
      },
    });
  }

  if (!data.metadata?.lineItems) {
    throw new ApplicationError('Missing required stripe metadata line items', {
      code: ErrorCode.ERROR_NOT_FOUND,
      status: StatusCode.NotFound,
      data: {
        param: 'metadata.lineItems',
      },
    });
  }

  const metadataLineItems = json.parse<MetadataLineItem[]>(
    data.metadata.lineItems
  );

  const lineItems = await Promise.all(
    metadataLineItems.map(async metadataLineItem => {
      const productId = Number(metadataLineItem.productId);
      const product = await productRepo.findById(productId);

      if (!product) {
        throw new ApplicationError('Cannot find store product', {
          code: ErrorCode.ERROR_NOT_FOUND,
          status: StatusCode.NotFound,
          data: {
            productId,
          },
        });
      }

      if (!metadataLineItem.quantity) {
        throw new ApplicationError('Missing required stripe quantity field', {
          code: ErrorCode.ERROR_NOT_FOUND,
          status: StatusCode.NotFound,
          data: {
            param: 'line_items.quantity',
          },
        });
      }

      return {
        quantity: metadataLineItem.quantity,
        product,
      };
    })
  );

  if (!data.shipping.address) {
    throw new ApplicationError('Missing required stripe address field', {
      code: ErrorCode.ERROR_NOT_FOUND,
      status: StatusCode.NotFound,
      data: {
        parameter: 'shipping.address',
      },
    });
  }

  await completeCheckoutSession({
    shippingAddress: transformStripeAddress(data.shipping.address),
    billingAddress: transformStripeAddress(data.shipping.address),
    lineItems,
    customer: {
      name: data.shipping.name,
      email: data.customer_details.email,
    },
  });
}

function transformStripeAddress(address: Stripe.Address): AddressFields {
  if (!address.line1) {
    throw new ApplicationError('Missing required stripe address parameter', {
      code: ErrorCode.ERROR_NOT_FOUND,
      status: StatusCode.NotFound,
      data: {
        parameter: 'line1',
      },
    });
  }

  if (!address.city) {
    throw new ApplicationError('Missing required stripe address parameter', {
      code: ErrorCode.ERROR_NOT_FOUND,
      status: StatusCode.NotFound,
      data: {
        parameter: 'city',
      },
    });
  }

  if (!address.state) {
    throw new ApplicationError('Missing required stripe address parameter', {
      code: ErrorCode.ERROR_NOT_FOUND,
      status: StatusCode.NotFound,
      data: {
        parameter: 'state',
      },
    });
  }

  if (!address.postal_code) {
    throw new ApplicationError('Missing required stripe address parameter', {
      code: ErrorCode.ERROR_NOT_FOUND,
      status: StatusCode.NotFound,
      data: {
        parameter: 'postal_code',
      },
    });
  }

  return {
    addressLine1: address.line1,
    addressLine2: address.line2 ?? undefined,
    city: address.city,
    province: address.state,
    postalCode: address.postal_code,
    country: address.country as Country,
  };
}

export async function handleReply(
  reply: FastifyReply,
  status: StatusCode
): Promise<void> {
  await reply.status(status).send();
}
