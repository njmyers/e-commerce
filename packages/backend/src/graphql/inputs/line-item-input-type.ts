import { InputType, Field } from 'type-graphql';
import { ProductInput } from './product-input-type';

@InputType()
export class LineItemInput {
  @Field()
  quantity!: number;

  @Field(() => ProductInput)
  product!: ProductInput;
}
