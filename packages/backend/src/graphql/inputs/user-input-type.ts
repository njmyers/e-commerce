import { InputType, Field } from 'type-graphql';
import { IsEmail, IsString } from 'class-validator';

@InputType()
export class UserInput {
  @Field()
  @IsEmail()
  email!: string;

  @Field()
  @IsString()
  name!: string;
}
