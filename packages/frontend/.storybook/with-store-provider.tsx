import * as React from 'react';
import { StoreProvider } from '../src/store-provider';

import { API_URL, STORE_NAME } from '../test/constants';

export function withStoreProvider(Story: () => JSX.Element) {
  return (
    <StoreProvider apiUrl={API_URL} storeName={STORE_NAME}>
      <Story />
    </StoreProvider>
  );
}
