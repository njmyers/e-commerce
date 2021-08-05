import { User } from '../../models';
import { ApplicationError, ErrorCode, StatusCode } from '../error';

import { Permission, Scope, Rule, RulesByRole, Role } from './permission';
import { defaultConfig } from './default-config';

export interface Resource {
  id: number;
}

export interface ResourceScope<T extends Resource> {
  requester?: T | null;
  owners?: T[];
}

export interface CheckPermissionsArgs {
  shop?: ResourceScope<User>;
  user?: ResourceScope<User>;
  role?: Role;
  permission: Permission;
  config?: RulesByRole;
}

export function checkPermissions({
  user,
  shop,
  role,
  permission,
  config = defaultConfig,
}: CheckPermissionsArgs): boolean {
  if (!role) {
    return false;
  }

  const rules = config[role];

  if (!rules) {
    return false;
  }

  const rule = rules.find(byPermission(permission));

  if (!rule) {
    return false;
  }

  switch (rule.scope) {
    case Scope.Application: {
      return true;
    }

    case Scope.User: {
      if (!user) {
        return true;
      }

      return Boolean(
        user.owners?.some(owner => owner.id === user.requester?.id)
      );
    }

    case Scope.Shop: {
      if (!shop) {
        return true;
      }

      return Boolean(
        shop.owners?.some(owner => owner.id === shop.requester?.id)
      );
    }

    default: {
      throw new ApplicationError('Cannot find requested scope', {
        code: ErrorCode.ERROR_NOT_FOUND,
        status: StatusCode.NotFound,
        data: {
          scope: rule.scope,
        },
      });
    }
  }
}

function byPermission(permission: Permission) {
  return (rule: Rule) => {
    return rule.permission === permission;
  };
}
