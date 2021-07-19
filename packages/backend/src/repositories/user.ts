import { Populate } from '@mikro-orm/core';
import { orm } from '../lib/orm';
import { ClassType } from '../graphql/connection';
import {
  PasswordField,
  Admin,
  AdminFields,
  Customer,
  CustomerFields,
  Merchant,
  MerchantFields,
  User,
} from '../models';
import { ApplicationError, StatusCode, ErrorCode } from '../lib/error';
import { Role } from '../lib';
export interface UserByRole {
  [Role.Admin]: unknown;
  [Role.Customer]: unknown;
  [Role.Merchant]: unknown;
}
export interface UserInputByRole extends UserByRole {
  [Role.Admin]: AdminFields & PasswordField;
  [Role.Customer]: CustomerFields & PasswordField;
  [Role.Merchant]: MerchantFields & PasswordField;
}

export interface UserTypeByRole extends UserByRole {
  [Role.Admin]: Admin;
  [Role.Customer]: Customer;
  [Role.Merchant]: Merchant;
}

export interface UserConstructorTypesByRole extends UserByRole {
  [Role.Admin]: ClassType<Admin>;
  [Role.Customer]: ClassType<Customer>;
  [Role.Merchant]: ClassType<Merchant>;
}

async function create<T extends Role>(
  role: T,
  input: UserInputByRole[T]
): Promise<UserTypeByRole[T]> {
  const Constructor = getConstructor(role);
  const user = new Constructor(input);

  if (input.password) {
    await user.setPassword(input.password);
  }

  orm.em.persist(user);

  // @ts-expect-error TODO: fix me please
  return user;
}

export interface FindByIdArgs<T extends Role> {
  id: number;
  role?: T;
  populate?: Populate<UserTypeByRole[T]>;
}

async function findById<T extends Role>({
  role,
  id,
  populate,
}: FindByIdArgs<T>): Promise<UserTypeByRole[T] | null> {
  const Constructor = role ? getConstructor(role) : User;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return await orm.em.findOne(Constructor, { id }, populate);
}

export interface FindByEmailArgs<T extends Role> {
  email: string;
  role?: T;
  populate?: Populate<UserTypeByRole[T]>;
}

async function findByEmail<T extends Role>({
  email,
  role,
  populate,
}: FindByEmailArgs<T>): Promise<UserTypeByRole[T] | null> {
  const Constructor = role ? getConstructor(role) : User;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return await orm.em.findOne(Constructor, { email }, populate);
}

export interface FindAllArgs {
  populate?: Populate<User>;
}

async function findAll({ populate }: FindAllArgs = {}): Promise<User[]> {
  return await orm.em.find(User, {}, populate);
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
  const Constructor = getConstructor(role);
  const user = (await orm.em.findOne(Constructor, { id })) as UserTypeByRole[T];

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

function getConstructor<T extends Role>(
  role: Role
): UserConstructorTypesByRole[T] {
  switch (role) {
    case Role.Admin: {
      // @ts-expect-error TODO: fix me please
      return Admin;
    }

    case Role.Customer: {
      return Customer;
    }

    case Role.Merchant: {
      // @ts-expect-error TODO: fix me please
      return Merchant;
    }

    default: {
      throw new Error(`Role is not defined: ${String(role)}`);
    }
  }
}

export const userRepo = {
  findById,
  findByEmail,
  findAll,
  create,
  update,
};
