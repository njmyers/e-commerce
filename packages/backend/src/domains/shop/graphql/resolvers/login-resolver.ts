import { Resolver, Arg, Mutation } from 'type-graphql';

import { orm } from '../../../../lib/orm';

import { LoginInput } from '../inputs/login-input-type';
import { Session } from '../types/session-type';
import { login } from '../../actions/login';

@Resolver(() => Session)
export class LoginResolver {
  @Mutation(() => Session)
  async login(@Arg('input') input: LoginInput): Promise<Session> {
    return await orm.run(async () => {
      return login(input);
    });
  }
}
