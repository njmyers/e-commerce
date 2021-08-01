import { InputType, Field, ID } from 'type-graphql';

@InputType()
export class ProductInput {
  @Field(() => ID)
  id!: number;
}
