import { Populate } from '@mikro-orm/core';
import { orm } from '../../../lib/context';
import {
  PasswordField,
  Admin,
  AdminFields,
  Customer,
  CustomerFields,
  Merchant,
  MerchantFields,
} from '../models';
import { ApplicationError, StatusCode, ErrorCode } from '../../../lib/error';
import { Role } from '../lib';

export interface UserInputByRole {
  [Role.Admin]: AdminFields & PasswordField;
  [Role.Customer]: CustomerFields & PasswordField;
  [Role.Merchant]: MerchantFields & PasswordField;
}

export interface UserTypeByRole {
  [Role.Admin]: Admin;
  [Role.Customer]: Customer;
  [Role.Merchant]: Merchant;
}

const UserConstructorsByRole = {
  [Role.Admin]: Admin,
  [Role.Customer]: Customer,
  [Role.Merchant]: Merchant,
};

async function create<T extends Role>(
  role: T,
  input: UserInputByRole[T]
): Promise<UserTypeByRole[T]> {
  const Constructor = UserConstructorsByRole[role];
  const user = new Constructor(input);

  if (input.password) {
    await user.setPassword(input.password);
  }

  orm.em.persist(user);
  return user;
}

export interface FindByIdArgs<T extends Role> {
  id: number;
  role: T;
  populate?: Populate<UserTypeByRole[T]>;
}

async function findById<T extends Role>({
  role,
  id,
  populate,
}: FindByIdArgs<T>): Promise<UserTypeByRole[T] | null> {
  const Constructor = UserConstructorsByRole[role];
  // @ts-expect-error TODO: Fix me please
  return await orm.em.findOne(Constructor, { id }, populate);
}

export interface FindByEmailArgs<T extends Role> {
  email: string;
  role: T;
  populate?: Populate<UserTypeByRole[T]>;
}

async function findByEmail<T extends Role>({
  email,
  role,
  populate,
}: FindByEmailArgs<T>): Promise<UserTypeByRole[T] | null> {
  const Constructor = UserConstructorsByRole[role];
  // @ts-expect-error TODO: Fix me please
  return await orm.em.findOne(Constructor, { role, email }, populate);
}

export interface UpdateArgs<T extends Role> {
  id: number;
  role: Role;
  input: Partial<UserInputByRole[T]>;
}

async function update<T extends Role>({
  id,
  role,
  input,
}: UpdateArgs<T>): Promise<UserTypeByRole[T]> {
  const Constructor = UserConstructorsByRole[role];
  const user = await orm.em.findOne(Constructor, { id });

  if (!user) {
    throw new ApplicationError('Cannot find user with id', {
      status: StatusCode.NotFound,
      code: ErrorCode.ERROR_NOT_FOUND,
      data: {
        id,
        role,
      },
    });
  }

  const { password, ...rest } = input;
  if (typeof password === 'string') {
    await user.setPassword(password);
  }

  Object.entries(rest).forEach(([field, value]) => {
    if (value) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      user[field] = value;
    }
  });

  return user;
}

export const userRepo = {
  findById,
  findByEmail,
  create,
  update,
};
