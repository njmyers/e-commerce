import * as React from 'react';

import { Form, Input, Button, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import { useLogin, Options } from './use-login';
import { TOKEN_KEY } from '../constants';

import { browserOnly } from '../utils/browserOnly';
import { noop } from '../utils/noop';

interface Fields {
  email: string;
  password: string;
}

export function Login(props: Options) {
  const [login, state] = useLogin(props);
  const [form] = Form.useForm<Fields>();

  const handleReset = () => {
    form.resetFields();
  };

  const handleFinish = async () => {
    const input = form.getFieldsValue(true) as Fields;
    const result = await login({ variables: { input } });

    const token = result.data?.login.token;

    if (token) {
      browserOnly(window => {
        try {
          window.localStorage.setItem(TOKEN_KEY, token);
        } catch {
          // ignore
        }
      }, noop);
    }
  };

  return (
    <Form layout="vertical" form={form} name="login" onFinish={handleFinish}>
      <Form.Item
        label="Email"
        name="email"
        rules={[{ required: true, message: 'Please input your email' }]}
      >
        <Input autoComplete="email" prefix={<UserOutlined />} />
      </Form.Item>
      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please input your password' }]}
      >
        <Input.Password
          autoComplete="current-password"
          prefix={<LockOutlined />}
        />
      </Form.Item>
      <Form.Item>
        <Button loading={state.loading} type="primary" htmlType="submit">
          Login
        </Button>
        <Button type="link" onClick={handleReset}>
          Reset
        </Button>
      </Form.Item>
      <Form.Item>
        <Form.ErrorList
          errors={state.error?.graphQLErrors.map(error => {
            return (
              <Typography.Text type="danger" key={error.message}>
                {error.message}
              </Typography.Text>
            );
          })}
        />
      </Form.Item>
    </Form>
  );
}
