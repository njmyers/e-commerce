import {
  Resolver,
  Query,
  Root,
  Args,
  Arg,
  Mutation,
  InputType,
  Field,
  FieldResolver,
  Authorized,
} from 'type-graphql';
import { IsString } from 'class-validator';

import { Permission } from '../../lib/permissions';
import { shopRepo } from '../../repositories';
import { Shop, ShopFields, Product, Customer, Merchant } from '../../models';
import { orm } from '../../lib/orm';
import {
  ConnectionInput,
  IConnection,
  resolveConnectionFromCollection,
} from '../connection';

@InputType({ description: 'Create a new shop' })
export class ShopMutationInput implements ShopFields {
  @Field()
  @IsString()
  public name!: string;

  @Field()
  @IsString()
  description!: string;
}

@Resolver(() => Shop)
export class ShopResolver {
  @Authorized(Permission.ReadShop)
  @Query(() => Shop)
  async shop(@Arg('id') id: number): Promise<Shop | null> {
    return await orm.run(async () => {
      return await shopRepo.findById(id);
    });
  }

  @Authorized(Permission.ReadAllShops)
  @Query(() => [Shop])
  async shops(): Promise<Shop[]> {
    return await orm.run(async () => {
      return await shopRepo.findAll();
    });
  }

  @Authorized(Permission.CreateShop)
  @Mutation(() => Shop)
  async addShop(@Arg('input') input: ShopMutationInput): Promise<Shop> {
    return await orm.run(async () => {
      return await shopRepo.create(input);
    });
  }

  @FieldResolver()
  async products(
    @Args() input: ConnectionInput,
    @Root() shop: Shop
  ): Promise<IConnection<Product>> {
    return await resolveConnectionFromCollection(input, shop.products);
  }

  @FieldResolver()
  async customers(
    @Args() input: ConnectionInput,
    @Root() shop: Shop
  ): Promise<IConnection<Customer>> {
    return await resolveConnectionFromCollection(input, shop.customers);
  }

  @FieldResolver()
  async merchants(
    @Args() input: ConnectionInput,
    @Root() shop: Shop
  ): Promise<IConnection<Merchant>> {
    return await resolveConnectionFromCollection(input, shop.customers);
  }
}
