import {
  Resolver,
  Query,
  Root,
  Args,
  Arg,
  Mutation,
  FieldResolver,
  Authorized,
  Ctx,
  Int,
} from 'type-graphql';

import { shopRepo } from '../../repositories';
import { CreateShopInput, UpdateShopInput } from '../inputs';
import { Shop, Product, Customer, Merchant, User } from '../../models';
import { orm } from '../../lib/orm';
import { Permission, checkPermissions } from '../../lib/permissions';
import { AdminGraphQLContext } from '../context/admin-context';
import { EntityID } from '../../models/id';

import {
  ConnectionInput,
  IConnection,
  resolveConnectionFromCollection,
} from '../connection';
import { ApplicationError, ErrorCode, StatusCode } from '../../lib/error';

@Resolver(() => Shop)
export class ShopResolver {
  @Authorized(Permission.ReadShop)
  @Query(() => Shop)
  async shop(
    @Arg('id', () => Int) id: EntityID,
    @Ctx() ctx: AdminGraphQLContext
  ): Promise<Shop> {
    return await orm.run(async () => {
      const shop = await shopRepo.findById(id, ['merchants']);

      if (!shop) {
        throw new ApplicationError('Cannot find shop', {
          status: StatusCode.BadRequest,
          code: ErrorCode.ERROR_MALFORMED_REQUEST,
        });
      }

      if (
        checkPermissions({
          permission: Permission.ReadShop,
          role: ctx.user?.role,
          shop: {
            requester: ctx.user,
            owners: shop.merchants.toArray() as User[],
          },
        })
      ) {
        return shop;
      }

      throw new ApplicationError('Cannot find shop', {
        status: StatusCode.BadRequest,
        code: ErrorCode.ERROR_MALFORMED_REQUEST,
      });
    });
  }

  @Authorized(Permission.ReadShop)
  @Query(() => [Shop])
  async shops(@Ctx() ctx: AdminGraphQLContext): Promise<Shop[]> {
    return await orm.run(async () => {
      const shops = await shopRepo.findAll(['merchants']);

      return shops.filter(shop => {
        return checkPermissions({
          permission: Permission.ReadShop,
          role: ctx.user?.role,
          shop: {
            requester: ctx.user,
            owners: shop.merchants.toArray() as User[],
          },
        });
      });
    });
  }

  @Authorized(Permission.CreateShop)
  @Mutation(() => Shop)
  async createShop(@Arg('input') input: CreateShopInput): Promise<Shop> {
    return await orm.run(async () => {
      return await shopRepo.create(input);
    });
  }

  @Authorized(Permission.UpdateShop)
  @Mutation(() => Shop)
  async updateShop(
    @Arg('id', () => Int) id: EntityID,
    @Arg('input') input: UpdateShopInput,
    @Ctx() ctx: AdminGraphQLContext
  ): Promise<Shop> {
    return await orm.run(async () => {
      const shop = await shopRepo.findById(id, ['merchants']);

      if (!shop) {
        throw new ApplicationError('Cannot find shop to update', {
          status: StatusCode.BadRequest,
          code: ErrorCode.ERROR_MALFORMED_REQUEST,
        });
      }

      if (
        !checkPermissions({
          permission: Permission.ReadShop,
          role: ctx.user?.role,
          shop: {
            requester: ctx.user,
            owners: shop.merchants.toArray() as User[],
          },
        })
      ) {
        throw new ApplicationError('Cannot find shop to update', {
          status: StatusCode.BadRequest,
          code: ErrorCode.ERROR_MALFORMED_REQUEST,
        });
      }

      return await shopRepo.update(id, input);
    });
  }

  @Authorized(Permission.ReadProduct)
  @FieldResolver()
  async products(
    @Args() input: ConnectionInput,
    @Root() shop: Shop
  ): Promise<IConnection<Product>> {
    return await resolveConnectionFromCollection(input, shop.products);
  }

  @Authorized(Permission.ReadCustomer)
  @FieldResolver()
  async customers(
    @Args() input: ConnectionInput,
    @Root() shop: Shop
  ): Promise<IConnection<Customer>> {
    return await resolveConnectionFromCollection(input, shop.customers);
  }

  @Authorized(Permission.ReadAdmin)
  @FieldResolver()
  async merchants(
    @Args() input: ConnectionInput,
    @Root() shop: Shop
  ): Promise<IConnection<Merchant>> {
    return await resolveConnectionFromCollection(input, shop.customers);
  }
}
