import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { Layout } from 'antd';

import { Login } from '../login';

import * as paths from '../paths';

import './login.css';

function LoginPage() {
  const history = useHistory();

  const handleCompleted = () => {
    history.push(paths.SHOPS);
  };

  return (
    <Layout>
      <Layout.Content className="login" hasSider={false}>
        <Login onCompleted={handleCompleted} />
      </Layout.Content>
    </Layout>
  );
}

export default LoginPage;
