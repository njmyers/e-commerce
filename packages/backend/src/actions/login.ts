import { userRepo } from '../repositories';
import { password } from '../lib';
import { ApplicationError, ErrorCode } from '../lib/error';
import { createToken } from '../lib/token';

import { LoginInput } from '../graphql/inputs/login-input-type';
import { Session } from '../graphql/types/session-type';

export async function login(input: LoginInput): Promise<Session> {
  const user = await userRepo.findByEmail({
    email: input.email,
  });

  if (!user?.password) {
    throw new ApplicationError('Could not login with credentials', {
      code: ErrorCode.ERROR_UNAUTHORIZED,
    });
  }

  if (!(await password.check(input.password, user.password))) {
    throw new ApplicationError('Could not login with credentials', {
      code: ErrorCode.ERROR_UNAUTHORIZED,
    });
  }

  return {
    token: await createToken({
      email: user.email,
      id: user.id,
    }),
  };
}
