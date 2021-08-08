import {
  Resolver,
  Query,
  Arg,
  Args,
  Int,
  Ctx,
  Authorized,
  Mutation,
} from 'type-graphql';

import { productRepo, shopRepo } from '../../repositories';
import { Product, ProductsConnection } from '../../models';
import { CreateProductInput, UpdateProductInput } from '../inputs';

import { orm } from '../../lib/orm';
import {
  resolveConnectionFromCollection,
  ConnectionInput,
  IConnection,
} from '../connection';
import { ShopGraphQLContext, AdminGraphQLContext } from '../context';
import { Permission } from '../../lib/permissions';
import { EntityID } from '../../models/id';
import { ApplicationError, ErrorCode, StatusCode } from '../../lib/error';

@Resolver(() => Product)
export class ShopProductResolver {
  @Authorized(Permission.ReadProduct)
  @Query(() => Product)
  async product(@Arg('id') id: number): Promise<Product | null> {
    return await orm.run(async () => {
      return await productRepo.findById(id);
    });
  }

  @Authorized(Permission.ReadProduct)
  @Query(() => ProductsConnection)
  async products(
    @Args() input: ConnectionInput,
    @Ctx() ctx: ShopGraphQLContext
  ): Promise<IConnection<Product>> {
    return await orm.run(async () => {
      return await resolveConnectionFromCollection(input, ctx.shop.products);
    });
  }
}

export class AdminProductResolver {
  @Authorized(Permission.CreateProduct)
  @Mutation(() => Product)
  async createShopProduct(
    @Arg('shopId', () => Int) shopId: EntityID,
    @Arg('input') input: CreateProductInput,
    @Ctx() ctx: AdminGraphQLContext
  ): Promise<Product | null> {
    return await orm.run(async em => {
      if (!ctx.user) {
        throw new ApplicationError('Cannot update product', {
          code: ErrorCode.ERROR_UNAUTHORIZED,
          status: StatusCode.Unauthorized,
        });
      }

      const shop = await shopRepo.findOwnedShopById({
        id: shopId,
        user: ctx.user,
        permission: Permission.CreateProduct,
      });

      if (!shop) {
        throw new ApplicationError('Cannot update product', {
          code: ErrorCode.ERROR_UNAUTHORIZED,
          status: StatusCode.Unauthorized,
        });
      }

      const product = productRepo.create({ ...input, shop });
      await em.flush();
      return product;
    });
  }

  @Authorized(Permission.CreateProduct)
  @Mutation(() => Product)
  async updateShopProduct(
    @Arg('shopId', () => Int) shopId: EntityID,
    @Arg('productId', () => Int) productId: EntityID,
    @Arg('input') input: UpdateProductInput,
    @Ctx() ctx: AdminGraphQLContext
  ): Promise<Product | null> {
    return await orm.run(async em => {
      if (!ctx.user) {
        throw new ApplicationError('Cannot update product', {
          code: ErrorCode.ERROR_UNAUTHORIZED,
          status: StatusCode.Unauthorized,
        });
      }

      const shop = await shopRepo.findOwnedShopById({
        id: shopId,
        user: ctx.user,
        permission: Permission.CreateProduct,
      });

      if (!shop) {
        throw new ApplicationError('Cannot update product', {
          code: ErrorCode.ERROR_UNAUTHORIZED,
          status: StatusCode.Unauthorized,
        });
      }

      const product = productRepo.update(productId, { ...input, shop });
      await em.flush();
      return product;
    });
  }
}
