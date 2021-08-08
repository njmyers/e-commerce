export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
};

/** Product data used for creating a new product */
export type CreateProductInput = {
  name: Scalars['String'];
  description: Scalars['String'];
  price: Scalars['Int'];
  length: Scalars['Int'];
  width: Scalars['Int'];
  height: Scalars['Int'];
  mass: Scalars['Int'];
};

/** Shop data used for creating a new shop */
export type CreateShopInput = {
  name: Scalars['String'];
  description: Scalars['String'];
};

export type Customer = {
  __typename?: 'Customer';
  id: Scalars['ID'];
  email: Scalars['String'];
  name: Scalars['String'];
  role: Role;
  orders: OrderConnection;
};

export type CustomerOrdersArgs = {
  first: Maybe<Scalars['Int']>;
  after: Maybe<Scalars['ID']>;
};

export type CustomerConnection = {
  __typename?: 'CustomerConnection';
  totalCount: Scalars['Int'];
  edges: Array<CustomerEdge>;
  pageInfo: CustomerPageInfo;
};

export type CustomerEdge = {
  __typename?: 'CustomerEdge';
  node: Customer;
  cursor: Scalars['ID'];
};

export type CustomerPageInfo = {
  __typename?: 'CustomerPageInfo';
  endCursor: Scalars['String'];
  hasNextPage: Scalars['Boolean'];
};

export type LineItem = {
  __typename?: 'LineItem';
  id: Scalars['ID'];
  quantity: Scalars['Int'];
  product: Product;
};

/** Login with a user */
export type LoginInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type Merchant = {
  __typename?: 'Merchant';
  id: Scalars['ID'];
  email: Scalars['String'];
  name: Scalars['String'];
  role: Role;
};

export type MerchantConnection = {
  __typename?: 'MerchantConnection';
  totalCount: Scalars['Int'];
  edges: Array<MerchantEdge>;
  pageInfo: MerchantPageInfo;
};

export type MerchantEdge = {
  __typename?: 'MerchantEdge';
  node: Merchant;
  cursor: Scalars['ID'];
};

export type MerchantPageInfo = {
  __typename?: 'MerchantPageInfo';
  endCursor: Scalars['String'];
  hasNextPage: Scalars['Boolean'];
};

export type Mutation = {
  __typename?: 'Mutation';
  login: Session;
  createShopProduct: Product;
  updateShopProduct: Product;
  createShop: Shop;
  updateShop: Shop;
};

export type MutationLoginArgs = {
  input: LoginInput;
};

export type MutationCreateShopProductArgs = {
  input: CreateProductInput;
  shopId: Scalars['Int'];
};

export type MutationUpdateShopProductArgs = {
  input: UpdateProductInput;
  productId: Scalars['Int'];
  shopId: Scalars['Int'];
};

export type MutationCreateShopArgs = {
  input: CreateShopInput;
};

export type MutationUpdateShopArgs = {
  input: UpdateShopInput;
  id: Scalars['Int'];
};

export type Order = {
  __typename?: 'Order';
  id: Scalars['ID'];
  number: Scalars['String'];
  total: Scalars['Int'];
  tax: Scalars['Int'];
  notes: Scalars['String'];
  shippedAt: Scalars['DateTime'];
  lineItems: Array<LineItem>;
};

export type OrderConnection = {
  __typename?: 'OrderConnection';
  totalCount: Scalars['Int'];
  edges: Array<OrderEdge>;
  pageInfo: OrderPageInfo;
};

export type OrderEdge = {
  __typename?: 'OrderEdge';
  node: Order;
  cursor: Scalars['ID'];
};

export type OrderPageInfo = {
  __typename?: 'OrderPageInfo';
  endCursor: Scalars['String'];
  hasNextPage: Scalars['Boolean'];
};

export type Product = {
  __typename?: 'Product';
  id: Scalars['ID'];
  name: Scalars['String'];
  description: Scalars['String'];
  price: Scalars['Int'];
  length: Scalars['Int'];
  height: Scalars['Int'];
  width: Scalars['Int'];
  mass: Scalars['Int'];
};

export type ProductsConnection = {
  __typename?: 'ProductsConnection';
  totalCount: Scalars['Int'];
  edges: Array<ProductsEdge>;
  pageInfo: ProductsPageInfo;
};

export type ProductsEdge = {
  __typename?: 'ProductsEdge';
  node: Product;
  cursor: Scalars['ID'];
};

export type ProductsPageInfo = {
  __typename?: 'ProductsPageInfo';
  endCursor: Scalars['String'];
  hasNextPage: Scalars['Boolean'];
};

export type Query = {
  __typename?: 'Query';
  shop: Shop;
  shops: Array<Shop>;
};

export type QueryShopArgs = {
  id: Scalars['Int'];
};

export enum Role {
  Admin = 'Admin',
  Merchant = 'Merchant',
  Customer = 'Customer',
}

export type Session = {
  __typename?: 'Session';
  token: Scalars['String'];
};

export type Shop = {
  __typename?: 'Shop';
  id: Scalars['ID'];
  name: Scalars['String'];
  description: Scalars['String'];
  customers: CustomerConnection;
  merchants: MerchantConnection;
  products: ProductsConnection;
};

export type ShopCustomersArgs = {
  first: Maybe<Scalars['Int']>;
  after: Maybe<Scalars['ID']>;
};

export type ShopMerchantsArgs = {
  first: Maybe<Scalars['Int']>;
  after: Maybe<Scalars['ID']>;
};

export type ShopProductsArgs = {
  first: Maybe<Scalars['Int']>;
  after: Maybe<Scalars['ID']>;
};

/** Product data used for updating a product */
export type UpdateProductInput = {
  name?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  price?: Maybe<Scalars['Int']>;
  length?: Maybe<Scalars['Int']>;
  width?: Maybe<Scalars['Int']>;
  height?: Maybe<Scalars['Int']>;
  mass?: Maybe<Scalars['Int']>;
};

/** Shop data used for updating a shop */
export type UpdateShopInput = {
  name?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
};

export type FetchCustomersQueryVariables = Exact<{
  shopId: Scalars['Int'];
  first: Maybe<Scalars['Int']>;
  after: Maybe<Scalars['ID']>;
}>;

export type FetchCustomersQuery = { __typename?: 'Query' } & {
  shop: { __typename?: 'Shop' } & Pick<Shop, 'id'> & {
      customers: { __typename?: 'CustomerConnection' } & Pick<
        CustomerConnection,
        'totalCount'
      > & {
          pageInfo: { __typename?: 'CustomerPageInfo' } & Pick<
            CustomerPageInfo,
            'endCursor' | 'hasNextPage'
          >;
          edges: Array<
            { __typename?: 'CustomerEdge' } & Pick<CustomerEdge, 'cursor'> & {
                node: { __typename?: 'Customer' } & Pick<
                  Customer,
                  'id' | 'name' | 'email'
                >;
              }
          >;
        };
    };
};

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;

export type LoginMutation = { __typename?: 'Mutation' } & {
  login: { __typename?: 'Session' } & Pick<Session, 'token'>;
};

export type CreateProductMutationVariables = Exact<{
  shopId: Scalars['Int'];
  input: CreateProductInput;
}>;

export type CreateProductMutation = { __typename?: 'Mutation' } & {
  createShopProduct: { __typename?: 'Product' } & Pick<
    Product,
    | 'id'
    | 'name'
    | 'description'
    | 'length'
    | 'width'
    | 'height'
    | 'price'
    | 'mass'
  >;
};

export type FetchProductsQueryVariables = Exact<{
  shopId: Scalars['Int'];
  first: Maybe<Scalars['Int']>;
  after: Maybe<Scalars['ID']>;
}>;

export type FetchProductsQuery = { __typename?: 'Query' } & {
  shop: { __typename?: 'Shop' } & Pick<Shop, 'id'> & {
      products: { __typename?: 'ProductsConnection' } & Pick<
        ProductsConnection,
        'totalCount'
      > & {
          pageInfo: { __typename?: 'ProductsPageInfo' } & Pick<
            ProductsPageInfo,
            'endCursor' | 'hasNextPage'
          >;
          edges: Array<
            { __typename?: 'ProductsEdge' } & Pick<ProductsEdge, 'cursor'> & {
                node: { __typename?: 'Product' } & Pick<
                  Product,
                  | 'id'
                  | 'name'
                  | 'description'
                  | 'price'
                  | 'height'
                  | 'length'
                  | 'width'
                  | 'mass'
                >;
              }
          >;
        };
    };
};

export type FetchShopQueryVariables = Exact<{
  id: Scalars['Int'];
}>;

export type FetchShopQuery = { __typename?: 'Query' } & {
  shop: { __typename?: 'Shop' } & Pick<Shop, 'id' | 'name' | 'description'>;
};

export type FetchShopsQueryVariables = Exact<{ [key: string]: never }>;

export type FetchShopsQuery = { __typename?: 'Query' } & {
  shops: Array<
    { __typename?: 'Shop' } & Pick<Shop, 'id' | 'name' | 'description'>
  >;
};

export type UpdateShopMutationVariables = Exact<{
  id: Scalars['Int'];
  input: UpdateShopInput;
}>;

export type UpdateShopMutation = { __typename?: 'Mutation' } & {
  updateShop: { __typename?: 'Shop' } & Pick<
    Shop,
    'id' | 'name' | 'description'
  >;
};
