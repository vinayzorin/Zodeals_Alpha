import React, { useState, useEffect } from 'react';
import { Layout, Menu } from 'antd';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import {
  DashboardOutlined,
  UserOutlined,
  ShopOutlined,
  CreditCardOutlined,
  AppstoreOutlined,
  TagOutlined,
  BellOutlined,
  MessageOutlined,
  LogoutOutlined,
  ShoppingOutlined,
  CustomerServiceOutlined
} from '@ant-design/icons';
import './Homepagecomponent.css';
import logo from '../assets/images/zodealsLogo.png';

const { Header, Sider, Content } = Layout;

const HomepageComponent = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();

  const handleResize = () => {
    const mobileView = window.innerWidth <= 768;
    setIsMobileView(mobileView);
    setCollapsed(mobileView);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/', { replace: true });
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        className={`sidebar ${collapsed ? 'collapsed' : ''}`}
        width={250}
        collapsedWidth={50}
        collapsible={!isMobileView}
        collapsed={collapsed}
        breakpoint="md"
        onCollapse={(collapsed) => setCollapsed(collapsed)}
      >
        <div className="sidebar-header">
          <Link to="/dashboard">
            <img
              src={logo}
              width={collapsed ? 60 : 170}
              height={50}
              alt="Zodeals Logo"
              style={{ cursor: 'pointer', marginRight:'30px' }}
            />
          </Link>
        </div>

        <div className="menu-scroll-container">
          <Menu mode="inline" defaultSelectedKeys={['1']} className="custom-menu">
            <Menu.Item key="1" icon={<DashboardOutlined />}>
              <Link to="/dashboard">{!collapsed && 'Dashboard'}</Link>
            </Menu.Item>
            <Menu.Item key="2" icon={<UserOutlined />}>
              <Link to="/userpage">{!collapsed && 'Users'}</Link>
            </Menu.Item>
            <Menu.Item key="3" icon={<ShopOutlined />}>
              <Link to="/vendorpage">{!collapsed && 'Vendors'}</Link>
            </Menu.Item>
              <Menu.Item key="4" icon={<CreditCardOutlined />}>
              <Link to="/agents">{!collapsed && 'Agents'}</Link>
            </Menu.Item>
            <Menu.Item key="5" icon={<CreditCardOutlined />}>
              <Link to="/payments">{!collapsed && 'Payments'}</Link>
            </Menu.Item>
            <Menu.Item key="6" icon={<AppstoreOutlined />}>
              <Link to="/categorypage">{!collapsed && 'Categories'}</Link>
            </Menu.Item>
            <Menu.Item key="7" icon={<ShoppingOutlined />}>
              <Link to="/products">{!collapsed && 'Products'}</Link>
            </Menu.Item>
            {/* <Menu.Item key="8" icon={<TagOutlined />}>
              <Link to="/coupen/price">{!collapsed && 'Coupon Price'}</Link>
            </Menu.Item> */}
            <Menu.Item key="9" icon={<BellOutlined />}>
              <Link to="/notifications">{!collapsed && 'Notifications'}</Link>
            </Menu.Item>
            <Menu.Item key="10" icon={<MessageOutlined />}>
              <Link to="/testimonial">{!collapsed && 'Testimonials'}</Link>
            </Menu.Item>
            <Menu.Item key="11" icon={<CustomerServiceOutlined />}>
              <Link to="/helpandsupport">{!collapsed && 'Help & Support'}</Link>
            </Menu.Item>
            <Menu.Item key="14" icon={<LogoutOutlined />} onClick={handleLogout}>
              {!collapsed && 'Logout'}
            </Menu.Item>
          </Menu>
        </div>
      </Sider>

      <Layout>
        <Header className="header" />
        <Content style={{ overflow: 'auto', height: 'calc(100vh - 64px)' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default HomepageComponent;
