import { orm } from '../../../lib/context';
import { User, UserFields } from '../models';
import { ApplicationError, StatusCode, ErrorCode } from '../../../lib/error';

export interface UserInput extends UserFields {
  password?: string;
}

async function create(input: UserInput): Promise<User> {
  const user = new User(input);

  if (input.password) {
    await user.setPassword(input.password);
  }

  orm.em.persist(user);
  await orm.em.flush();

  return user;
}

async function findById(id: number): Promise<User | null> {
  return await orm.em.findOne(User, { id });
}

async function findByEmail(email: string): Promise<User | null> {
  return await orm.em.findOne(User, {
    email,
  });
}

async function update(id: number, input: Partial<UserInput>): Promise<User> {
  const user = await orm.em.findOne(User, id);

  if (!user) {
    throw new ApplicationError('Cannot find user with id', {
      status: StatusCode.NotFound,
      code: ErrorCode.ERROR_NOT_FOUND,
      data: {
        id,
      },
    });
  }

  if (input.password) {
    await user.setPassword(input.password);
  }

  Object.entries(input).forEach(([field, value]) => {
    if (value) {
      user[field] = value;
    }
  });

  // await orm.em.flush();

  return user;
}

export const userRepo = {
  findById,
  findByEmail,
  create,
  update,
};
