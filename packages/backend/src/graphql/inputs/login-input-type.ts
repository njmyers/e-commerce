import { InputType, Field } from 'type-graphql';
import { IsEmail, IsString } from 'class-validator';

@InputType({ description: 'Login with a user' })
export class LoginInput {
  @Field()
  @IsEmail()
  email!: string;

  @Field({ nullable: false })
  @IsString()
  password!: string;
}
