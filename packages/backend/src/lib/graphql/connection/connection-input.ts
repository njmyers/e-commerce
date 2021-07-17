import { ArgsType, Field, Int, ID } from 'type-graphql';

@ArgsType()
export class ConnectionInput {
  @Field(() => Int, { nullable: true })
  first?: number;

  @Field(() => ID, { nullable: true })
  after?: string;
}
