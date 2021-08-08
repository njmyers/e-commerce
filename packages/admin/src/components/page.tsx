import * as React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { Menu, Button, Layout } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  SettingFilled,
  ShopOutlined,
  LogoutOutlined,
} from '@ant-design/icons';

import * as paths from '../paths';

import './page.css';

export interface PageProps {
  children: JSX.Element | null;
}

export function Page({ children }: PageProps) {
  const match = useRouteMatch(paths.SHOP_MATCH);

  const [collapsed, setCollapsed] = React.useState(true);
  const MenuIcon = collapsed ? MenuUnfoldOutlined : MenuFoldOutlined;

  const handleToggleClick = () => {
    setCollapsed(prevCollapsed => !prevCollapsed);
  };

  const topHeaderLinks = !match
    ? []
    : [
        {
          label: 'Home',
          path: `${match.url}`,
        },
        {
          label: 'Products',
          path: `${match.url}/products`,
        },
        {
          label: 'Customers',
          path: `${match.url}/customers`,
        },
        {
          label: 'Orders',
          path: `${match.url}/orders`,
        },
      ];

  const sideNavLinks = [
    {
      label: 'Shops',
      path: paths.SHOPS,
      icon: <ShopOutlined />,
    },
    {
      label: 'Settings',
      path: paths.SETTINGS,
      icon: <SettingFilled />,
    },
    {
      label: 'Logout',
      path: paths.LOGOUT,
      icon: <LogoutOutlined />,
    },
  ];

  return (
    <Layout>
      <Layout.Sider collapsed={collapsed}>
        <Button
          type="primary"
          onClick={handleToggleClick}
          style={{ marginBottom: 16 }}
        >
          <MenuIcon />
        </Button>
        <Menu mode="inline" theme="dark">
          {sideNavLinks.map(headerLink => {
            return (
              <Menu.Item icon={headerLink.icon} key={headerLink.path}>
                <Link to={headerLink.path}>{headerLink.label}</Link>
              </Menu.Item>
            );
          })}
        </Menu>
      </Layout.Sider>
      <Layout>
        <Layout.Header>
          <Menu theme="dark" mode="horizontal">
            {topHeaderLinks.map(headerLink => {
              return (
                <Menu.Item key={headerLink.path}>
                  <Link to={headerLink.path}>{headerLink.label}</Link>
                </Menu.Item>
              );
            })}
          </Menu>
        </Layout.Header>
        <Layout.Content className="page">{children}</Layout.Content>
        <Layout.Footer>Footer</Layout.Footer>
      </Layout>
    </Layout>
  );
}
