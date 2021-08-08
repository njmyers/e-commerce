import { InputType, Field, Int, ID } from 'type-graphql';
import { IsInt, IsString } from 'class-validator';

import { ProductFields } from '../../models';

@InputType()
export class ProductInput {
  @Field(() => ID)
  id!: number;
}

@InputType({ description: 'Product data used for creating a new product' })
export class CreateProductInput implements ProductFields {
  @Field()
  @IsString()
  name!: string;

  @Field()
  @IsString()
  description!: string;

  @Field(() => Int)
  @IsInt()
  price!: number;

  @Field(() => Int)
  @IsInt()
  length!: number;

  @Field(() => Int)
  @IsInt()
  width!: number;

  @Field(() => Int)
  @IsInt()
  height!: number;

  @Field(() => Int)
  @IsInt()
  mass!: number;
}

@InputType({ description: 'Product data used for updating a product' })
export class UpdateProductInput implements Partial<ProductFields> {
  @Field({ nullable: true })
  @IsString()
  name?: string;

  @Field({ nullable: true })
  @IsString()
  description?: string;

  @Field(() => Int, { nullable: true })
  @IsInt()
  price?: number;

  @Field(() => Int, { nullable: true })
  @IsInt()
  length?: number;

  @Field(() => Int, { nullable: true })
  @IsInt()
  width?: number;

  @Field(() => Int, { nullable: true })
  @IsInt()
  height?: number;

  @Field(() => Int, { nullable: true })
  @IsInt()
  mass?: number;
}
