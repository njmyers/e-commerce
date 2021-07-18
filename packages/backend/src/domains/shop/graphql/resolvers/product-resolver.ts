import {
  Resolver,
  Query,
  Arg,
  Args,
  InputType,
  Field,
  Ctx,
  Authorized,
  Mutation,
} from 'type-graphql';
import { IsInt, IsString } from 'class-validator';

import { productRepo } from '../../repositories';
import { ProductFields, Product, ProductsConnection } from '../../models';
import { orm } from '../../../../lib/orm';
import {
  resolveConnectionFromCollection,
  ShopGraphQLContext,
  ConnectionInput,
  IConnection,
} from '../../../../lib/graphql';
import { Permission } from '../../lib/permissions';

@InputType({ description: 'Create a new shop' })
export class CreateProductInput implements ProductFields {
  @Field()
  @IsString()
  public name!: string;

  @Field()
  @IsString()
  public description!: string;

  @Field()
  @IsInt()
  public price!: number;

  @Field()
  @IsInt()
  public length!: number;

  @Field()
  @IsInt()
  public width!: number;

  @Field()
  @IsInt()
  public height!: number;

  @Field()
  @IsInt()
  public mass!: number;
}

@Resolver(() => Product)
export class ProductResolver {
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

  @Authorized(Permission.CreateProduct)
  @Mutation(() => Product)
  async createProduct(
    @Arg('input') input: CreateProductInput,
    @Ctx() ctx: ShopGraphQLContext
  ): Promise<Product | null> {
    return await orm.run(async em => {
      const product = productRepo.create({ ...input, shop: ctx.shop });
      await em.flush();
      return product;
    });
  }
}
