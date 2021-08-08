import 'antd/dist/antd.css';

import * as React from 'react';
import { Routes } from '@njmyers/generator-plugin-react';

import { AdminProvider } from './admin-provider';

import { API_URL } from '../test/constants';

export default function App() {
  return (
    <AdminProvider apiUrl={API_URL}>
      <Routes />
    </AdminProvider>
  );
}
