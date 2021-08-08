import { InputType, Field } from 'type-graphql';
import { IsString } from 'class-validator';

import { ShopFields } from '../../models';

@InputType({ description: 'Shop data used for creating a new shop' })
export class CreateShopInput implements ShopFields {
  @Field()
  @IsString()
  name!: string;

  @Field()
  @IsString()
  description!: string;
}

@InputType({ description: 'Shop data used for updating a shop' })
export class UpdateShopInput implements Partial<ShopFields> {
  @Field({ nullable: true })
  @IsString()
  name?: string;

  @Field({ nullable: true })
  @IsString()
  description?: string;
}
