import { Role, Permission, Scope, RulesByRole } from './permission';

export const defaultConfig: RulesByRole = {
  [Role.Admin]: [
    {
      permission: Permission.CreateAdmin,
      scope: Scope.Application,
    },
    {
      permission: Permission.ReadAdmin,
      scope: Scope.Application,
    },
    {
      permission: Permission.UpdateAdmin,
      scope: Scope.Application,
    },
    {
      permission: Permission.DeleteAdmin,
      scope: Scope.Application,
    },

    {
      permission: Permission.CreateCustomer,
      scope: Scope.Shop,
    },
    {
      permission: Permission.ReadCustomer,
      scope: Scope.Shop,
    },
    {
      permission: Permission.UpdateCustomer,
      scope: Scope.Shop,
    },
    {
      permission: Permission.DeleteCustomer,
      scope: Scope.Shop,
    },

    {
      permission: Permission.CreateShop,
      scope: Scope.Application,
    },
    {
      permission: Permission.ReadShop,
      scope: Scope.Application,
    },
    {
      permission: Permission.UpdateShop,
      scope: Scope.Application,
    },
    {
      permission: Permission.DeleteShop,
      scope: Scope.Application,
    },

    {
      permission: Permission.CreateProduct,
      scope: Scope.Shop,
    },
    {
      permission: Permission.ReadProduct,
      scope: Scope.Application,
    },
    {
      permission: Permission.UpdateProduct,
      scope: Scope.Shop,
    },
    {
      permission: Permission.DeleteProduct,
      scope: Scope.Shop,
    },

    {
      permission: Permission.CreateOrder,
      scope: Scope.Shop,
    },
    {
      permission: Permission.ReadOrder,
      scope: Scope.Shop,
    },
    {
      permission: Permission.UpdateOrder,
      scope: Scope.Shop,
    },
    {
      permission: Permission.DeleteOrder,
      scope: Scope.Shop,
    },
  ],
  [Role.Merchant]: [
    {
      permission: Permission.CreateAdmin,
      scope: Scope.Shop,
    },
    {
      permission: Permission.ReadAdmin,
      scope: Scope.Shop,
    },
    {
      permission: Permission.UpdateAdmin,
      scope: Scope.Shop,
    },
    {
      permission: Permission.DeleteAdmin,
      scope: Scope.Shop,
    },

    {
      permission: Permission.CreateCustomer,
      scope: Scope.Shop,
    },
    {
      permission: Permission.ReadCustomer,
      scope: Scope.Shop,
    },
    {
      permission: Permission.UpdateCustomer,
      scope: Scope.Shop,
    },
    {
      permission: Permission.DeleteCustomer,
      scope: Scope.Shop,
    },

    {
      permission: Permission.CreateProduct,
      scope: Scope.Shop,
    },
    {
      permission: Permission.ReadProduct,
      scope: Scope.Application,
    },
    {
      permission: Permission.UpdateProduct,
      scope: Scope.Shop,
    },
    {
      permission: Permission.DeleteProduct,
      scope: Scope.Shop,
    },

    {
      permission: Permission.CreateOrder,
      scope: Scope.Shop,
    },
    {
      permission: Permission.ReadOrder,
      scope: Scope.Shop,
    },
    {
      permission: Permission.UpdateOrder,
      scope: Scope.Shop,
    },
    {
      permission: Permission.DeleteOrder,
      scope: Scope.Shop,
    },
  ],
  [Role.Customer]: [
    {
      permission: Permission.ReadOrder,
      scope: Scope.User,
    },
    {
      permission: Permission.ReadCustomer,
      scope: Scope.User,
    },
    {
      permission: Permission.ReadProduct,
      scope: Scope.Shop,
    },
    {
      permission: Permission.Checkout,
      scope: Scope.Shop,
    },
  ],
};
