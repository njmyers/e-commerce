export enum Role {
  Admin = 'admin',
  Merchant = 'merchant',
  Customer = 'customer',
}

export enum Permission {
  /** Admin Users */
  CreateAdmin = 'create_admin',
  ReadAdmin = 'read_admin',
  UpdateAdmin = 'update_admin',
  DeleteAdmin = 'delete_admin',

  /** Shop Users */
  CreateCustomer = 'create_customer',
  ReadCustomer = 'read_customer',
  UpdateCustomer = 'update_customer',
  DeleteCustomer = 'delete_customer',

  /** Shops */
  CreateShop = 'create_shop',
  ReadShop = 'read_shop',
  ReadAllShops = 'read_all_shops',
  UpdateShop = 'update_shop',
  DeleteShop = 'delete_shop',

  /** Products */
  CreateProduct = 'create_product',
  ReadProduct = 'read_product',
  UpdateProduct = 'update_product',
  DeleteProduct = 'delete_product',

  /** Orders */
  CreateOrder = 'create_order',
  ReadOrder = 'read_order',
  UpdateOrder = 'update_order',
  DeleteOrder = 'delete_order',

  /** Checkout */
  Checkout = 'checkout',
}

export enum Scope {
  Application = 'application',
  Shop = 'shop',
  User = 'user',
}

export interface Rule {
  permission: Permission;
  scope: Scope;
}

export type RulesByRole = {
  [key in Role]: Rule[];
};
