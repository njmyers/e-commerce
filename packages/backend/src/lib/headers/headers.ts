export enum HeaderKey {
  Authorization = 'Authorization',
  ShopToken = 'Shop-Token',
}

export interface Headers {
  [HeaderKey.Authorization]: unknown;
  [HeaderKey.ShopToken]: unknown;
}

export interface RawHeaders extends Headers {
  /** Authorization string using the `Bearer {{ token }}` string format */
  [HeaderKey.Authorization]: string;
  /** Authorization string using the `Shop {{ token }}` string format */
  [HeaderKey.ShopToken]: string;
}

export interface ParsedHeaders extends Headers {
  /** Parsed JSON web token */
  Authorization: string;
  /** Parsed shop identification token */
  Shop: string;
}

export type HeaderParser = {
  [K in keyof Headers]: (raw: RawHeaders[K]) => ParsedHeaders[K];
};

const BEARER_KEY = 'Bearer ';

function parseAuthorization(value: string): string {
  const [key] = value.split(BEARER_KEY).reverse();
  return key;
}

const SHOP_KEY = 'Shop ';

function parseShopToken(value: string): string {
  const [key] = value.split(SHOP_KEY).reverse();
  return key;
}

const HeaderParsers: HeaderParser = {
  [HeaderKey.Authorization]: parseAuthorization,
  [HeaderKey.ShopToken]: parseShopToken,
};

function parse<T extends keyof Headers>(
  headers: RawHeaders,
  key: T
): ParsedHeaders[T] {
  const parser = HeaderParsers[key];

  if (!parser) {
    return '';
  }

  const rawValue = headers[key] ?? headers[key.toLowerCase()];

  if (!rawValue) {
    return '';
  }

  const parsedValue = parser(rawValue);

  if (typeof parsedValue !== 'string') {
    return '';
  }

  return parsedValue;
}

export const headers = {
  parse,
};
