/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { fastify } from 'fastify';
import { ApolloServer } from 'apollo-server-fastify';
import { buildSchema, AuthChecker } from 'type-graphql';
import { config } from './config';

import {
  ShopResolver,
  LoginResolver,
  CustomerResolver,
  ProductResolver,
  OrderResolver,
  CheckoutSessionResolver,
} from './graphql/resolvers';

import { stripe } from './webhooks/stripe';
import { checkPermissions, Permission, Role } from './lib';
import {
  adminContext,
  shopContext,
  AdminGraphQLContext,
  ShopGraphQLContext,
} from './graphql/context';
import { registerEnums } from './graphql/register-enums';
import { ApplicationError, ErrorCode, StatusCode } from './lib/error';
import { logger } from './lib/logger';

const adminAuthChecker: AuthChecker<AdminGraphQLContext> = (
  { context },
  permissions
): boolean => {
  const { user } = context;

  if (!user) {
    return false;
  }

  return (permissions as Permission[]).every(permission => {
    return checkPermissions({
      role: user.role,
      permission,
    });
  });
};

const shopAuthChecker: AuthChecker<ShopGraphQLContext> = async (
  { context },
  permissions
): Promise<boolean> => {
  const { user, shop } = context;
  const [owner] = await shop.merchants.matching({
    where: { id: user?.id },
  });

  return (permissions as Permission[]).every(permission => {
    return checkPermissions({
      role: user?.role ?? Role.Customer,
      permission,
      user: {
        owner,
        requester: user,
      },
    });
  });
};

export async function createApp() {
  const app = fastify();

  // Must register before building schemas
  registerEnums();
  const adminSchema = await buildSchema({
    authChecker: adminAuthChecker,
    resolvers: [ShopResolver, LoginResolver, CustomerResolver, OrderResolver],
  });

  const { debug } = config.get('apollo');

  const adminServer = new ApolloServer({
    schema: adminSchema,
    playground: debug,
    context: adminContext,
    debug,
  });

  await app.register(
    adminServer.createHandler({
      path: '/admin',
    })
  );

  const shopSchema = await buildSchema({
    resolvers: [
      ProductResolver,
      LoginResolver,
      CustomerResolver,
      CheckoutSessionResolver,
      OrderResolver,
    ],
    authChecker: shopAuthChecker,
  });

  const shopServer = new ApolloServer({
    schema: shopSchema,
    context: shopContext,
  });

  await app.register(
    shopServer.createHandler({
      path: `/:shop`,
      disableHealthCheck: true,
    })
  );

  await app.register(stripe);

  app.all('/*', {}, () => {
    throw new ApplicationError('No route found', {
      status: StatusCode.NotFound,
      code: ErrorCode.ERROR_NOT_FOUND,
    });
  });

  return app;
}

if (require.main === module) {
  void (async () => {
    try {
      const app = await createApp();
      const url = await app.listen(
        config.get('app.port'),
        config.get('app.host')
      );

      logger.http(`Server is running on ${url}`);
    } catch (error: unknown) {
      logger.error('Server could not start', { error });
    }
  })();
}
