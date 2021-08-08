import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';

export function withRouter(Story: () => JSX.Element) {
  return (
    <MemoryRouter initialEntries={['/']}>
      <Story />
    </MemoryRouter>
  );
}
