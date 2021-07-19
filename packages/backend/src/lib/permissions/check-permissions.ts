import { User, Shop } from '../../models';
import { ApplicationError, ErrorCode, StatusCode } from '../error';

import { Permission, Scope, Rule, RulesByRole, Role } from './permission';
import { defaultConfig } from './default-config';

export interface ResourceScope<T extends { id: number }> {
  requester?: T | null;
  owner?: T | null;
}

export interface CheckPermissionsArgs {
  shop?: ResourceScope<Shop>;
  user?: ResourceScope<User>;
  role: Role;
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
      return user?.requester?.id === user?.owner?.id;
    }

    case Scope.Shop: {
      return shop?.requester?.id === shop?.owner?.id;
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
