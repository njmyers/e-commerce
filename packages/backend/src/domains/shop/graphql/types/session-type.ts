import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class Session {
  @Field()
  token!: string;
}
