import { Shop, User } from '../../models';
import { checkPermissions } from './check-permissions';
import { Permission, Scope, Role } from './permission';

const config = {
  [Role.Admin]: [
    {
      scope: Scope.Application,
      permission: Permission.CreateProduct,
    },
  ],
  [Role.Merchant]: [
    {
      scope: Scope.Shop,
      permission: Permission.CreateProduct,
    },
  ],
  [Role.Customer]: [
    {
      scope: Scope.User,
      permission: Permission.CreateProduct,
    },
  ],
};

describe('checkPermissions', () => {
  type TestCase = [
    description: string,
    args: Parameters<typeof checkPermissions>[0],
    result: boolean
  ];

  const cases: TestCase[] = [
    [
      'the role has no permissions defined',
      {
        // @ts-expect-error this is not a valid TS enum
        role: 'no-role',
        permission: Permission.CreateProduct,
      },
      false,
    ],
    [
      'the role does not have the specific permission',
      {
        role: Role.Admin,
        permission: Permission.DeleteAdmin,
      },
      false,
    ],
    [
      'the role has application scope',
      {
        role: Role.Admin,
        permission: Permission.CreateProduct,
      },
      true,
    ],
    [
      'the role has user scope and the wrong requester',
      {
        role: Role.Customer,
        permission: Permission.CreateProduct,
        user: {
          requester: { id: 1 } as User,
          owner: { id: 2 } as User,
        },
      },
      false,
    ],
    [
      'the role has user scope and the right requester',
      {
        role: Role.Customer,
        permission: Permission.CreateProduct,
        user: {
          requester: { id: 1 } as User,
          owner: { id: 1 } as User,
        },
      },
      true,
    ],
    [
      'the role has shop scope and the wrong requester',
      {
        role: Role.Merchant,
        permission: Permission.CreateProduct,
        shop: {
          requester: { id: 1 } as Shop,
          owner: { id: 2 } as Shop,
        },
      },
      false,
    ],
    [
      'the role has shop scope and the right requester',
      {
        role: Role.Merchant,
        permission: Permission.CreateProduct,
        shop: {
          requester: { id: 1 } as Shop,
          owner: { id: 1 } as Shop,
        },
      },
      true,
    ],
  ];

  test.each(cases)('when %s', (_, args, result) => {
    // @ts-expect-error testing cases not allowed by typescript
    expect(checkPermissions({ ...args, config })).toBe(result);
  });
});
