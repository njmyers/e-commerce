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
};

/** Create a new stripe checkout session */
export type CheckoutSessionInput = {
  lineItems?: Maybe<Array<LineItemInput>>;
  checkoutUrl: Scalars['String'];
};

export type LineItemInput = {
  quantity: Scalars['Float'];
  product: ProductInput;
};

/** Login with a user */
export type LoginInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  login: Session;
  createCheckoutSession: StripeCheckoutSession;
};

export type MutationLoginArgs = {
  input: LoginInput;
};

export type MutationCreateCheckoutSessionArgs = {
  input: CheckoutSessionInput;
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

export type ProductInput = {
  id: Scalars['ID'];
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
  product: Product;
  products: ProductsConnection;
};

export type QueryProductArgs = {
  id: Scalars['Float'];
};

export type QueryProductsArgs = {
  first: Maybe<Scalars['Int']>;
  after: Maybe<Scalars['ID']>;
};

export type Session = {
  __typename?: 'Session';
  token: Scalars['String'];
};

export type StripeCheckoutSession = {
  __typename?: 'StripeCheckoutSession';
  url: Scalars['String'];
};

export type CreateCheckoutSessionMutationVariables = Exact<{
  input: CheckoutSessionInput;
}>;

export type CreateCheckoutSessionMutation = { __typename?: 'Mutation' } & {
  createCheckoutSession: { __typename?: 'StripeCheckoutSession' } & Pick<
    StripeCheckoutSession,
    'url'
  >;
};

export type FetchProductsQueryVariables = Exact<{
  first: Maybe<Scalars['Int']>;
  after: Maybe<Scalars['ID']>;
}>;

export type FetchProductsQuery = { __typename?: 'Query' } & {
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
              | 'length'
              | 'height'
              | 'width'
              | 'mass'
            >;
          }
      >;
    };
};
