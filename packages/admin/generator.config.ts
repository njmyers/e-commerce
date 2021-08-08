import type { ConfigFile } from '@njmyers/generator-core';

const config: ConfigFile = {
  entrypoints: {
    client: 'src/client.tsx',
    server: 'src/app.tsx',
  },
  data: () => {
    return {};
  },
  pages: () => {
    return [
      {
        file: 'src/pages/login.tsx',
        slug: '/admin',
      },
      {
        file: 'src/pages/shops.tsx',
        slug: '/admin/shops',
      },
      {
        file: 'src/pages/shop.tsx',
        slug: '/admin/shop',
      },
      {
        file: 'src/pages/shop.tsx',
        slug: '/admin/shop/:shopId',
      },
      {
        file: 'src/pages/products.tsx',
        slug: '/admin/shop/:shopId/products',
      },
      {
        file: 'src/pages/create-product.tsx',
        slug: '/admin/shop/:shopId/product/create',
      },
      {
        file: 'src/pages/customers.tsx',
        slug: '/admin/shop/:shopId/customers',
      },
    ];
  },
  plugins: [
    '@njmyers/generator-plugin-typescript',
    '@njmyers/generator-plugin-react/server',
    [
      '@njmyers/generator-plugin-css',
      {
        cssOptions: {
          modules: false,
        },
      },
    ],
    require.resolve('./plugins/graphql-plugin.ts'),
  ],
};

export default config;
