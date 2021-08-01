import { FastifyRequest } from 'fastify';
import { Stripe } from 'stripe';

import { ApplicationError, ErrorCode } from '../../lib/error';
import { RawHeaders, HeaderKey, headers } from '../../lib/headers';
import { orm } from '../../lib/orm';
import { Shop } from '../../models/shop';
import { Admin } from '../../models/admin';
import { Merchant } from '../../models/merchant';
import { Customer } from '../../models/customer';

import { shopRepo } from '../../repositories/shop';
import { userRepo } from '../../repositories/user';

import { createStripe } from '../../services/stripe';

import { parseToken } from '../../lib/token';
import { Role } from '../../lib/permissions';
import { logger } from '../../lib/logger';

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
