import { FastifyRequest } from 'fastify';
import { Stripe } from 'stripe';

import { ApplicationError, ErrorCode } from '../../error';
import { RawHeaders, HeaderKey, headers } from '../../headers';
import { orm } from '../../orm';
import {
  Merchant,
  Customer,
  Admin,
  Shop,
  shopRepo,
  userRepo,
} from '../../../domains/shop';
import { parseToken } from '../../token';
import { Role } from '../../../domains/shop/lib';
import { logger } from '../../logger';
import { getSecret, ServiceProvider } from '../../../services/secrets';
export interface ShopGraphQLContext {
  shop: Shop;
  user?: Admin | Customer | Merchant | null;
  stripe: Stripe;
}

export interface ShopParams {
  shop: string;
}

export interface ShopRequest {
  Params?: ShopParams;
  Headers?: RawHeaders;
}

interface ContextArgs {
  request: FastifyRequest<ShopRequest>;
}

export const shopContext = async ({
  request,
}: ContextArgs): Promise<ShopGraphQLContext> => {
  const shopName = request?.params?.shop;

  if (!shopName) {
    throw new ApplicationError(`Cannot find a valid shopName parameter`, {
      code: ErrorCode.ERROR_MALFORMED_REQUEST,
    });
  }

  const user = await getMerchant(request);
  const shop = await orm.run(async () => {
    return await shopRepo.findByName(shopName);
  });

  if (!shop) {
    throw new ApplicationError(`Cannot find a valid shop`, {
      code: ErrorCode.ERROR_NOT_FOUND,
    });
  }

  const stripe = await createStripe(shop);

  logger.debug('Creating shop request context', {
    user,
    shop,
  });

  return {
    user,
    shop,
    stripe,
  };
};

async function getMerchant(
  request: FastifyRequest<ShopRequest>
): Promise<Merchant | null> {
  try {
    const token = headers.parse(request.headers, HeaderKey.Authorization);
    const payload = await parseToken(token);
    const user = await orm.run(async () => {
      return payload
        ? await userRepo.findById({ role: Role.Merchant, id: payload.id })
        : null;
    });
    return user;
  } catch {
    return null;
  }
}

async function createStripe(shop: Shop): Promise<Stripe> {
  const stripeToken = await getSecret({
    shopName: shop.name,
    serviceProvider: ServiceProvider.Stripe,
    keyName: 'stripeToken',
  });

  return new Stripe(stripeToken, {
    apiVersion: '2020-08-27',
  });
}
