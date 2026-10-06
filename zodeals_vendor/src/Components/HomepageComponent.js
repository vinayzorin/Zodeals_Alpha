import react,{useState, useEffect
} from 'react';
import { Layout, Menu, Avatar } from 'antd';
import { Link, Outlet,useNavigate  } from 'react-router-dom';
import {
  DashboardOutlined,
  UserOutlined,
  AppstoreOutlined,
  WalletOutlined,
  HistoryOutlined,
  LogoutOutlined,
  UsergroupAddOutlined,
  CustomerServiceOutlined,
} from '@ant-design/icons';
import './Homepagecomponent.css';
import logo from '../assets/images/zodealsLogo.png'
import { hosturl } from './libs/Constant';
const { Header, Sider, Content } = Layout;

const HomepageComponent = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768); // Check for mobile view
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null); // Store the full user object
  const navigate = useNavigate();

  const handleResize = () => {
    const mobileView = window.innerWidth <= 768;
    setIsMobileView(mobileView);
    setCollapsed(mobileView); // Collapse the sidebar for mobile view
  };

useEffect(() => {
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);

useEffect(() => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token || !role) {
    navigate('/', { replace: true });
  }
}, [navigate]);

    
  // const handleLogout = () => {
  //   localStorage.removeItem('token');
  //   localStorage.removeItem('role'); // or any other keys like 'user', 'userId', etc.
    
  //   navigate("/",{replace:true}); // or "/" if homepage is default
  // };
  const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role'); // Remove any other relevant keys

  // Force hard refresh to homepage (clears client-side state)
  window.location.replace("/");
};

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        className={`sidebar ${collapsed ? 'collapsed' : ''}`}
        width={250}
        collapsedWidth={50}
        collapsible={!isMobileView} // Only collapsible if it's a mobile view
        collapsed={collapsed}
        breakpoint="md"
        onCollapse={(collapsed) => setCollapsed(collapsed)}
      >
        {!collapsed ? <div className="sidebar-header">
          <img src={logo} width={170} height={50} />
          </div> : <div style={{ marginTop: 20, marginBottom: 20, display: 'flex', justifyContent: 'center' }} >
          <img src={logo} width={60} />
        </div>}
        <Menu mode="inline" defaultSelectedKeys={['1']} className="custom-menu">
          <Menu.Item key="1" icon={<DashboardOutlined style={{ color: '#fff' }} />}>
            <Link to="/dashboard">{!isMobileView && 'Dashboard'}</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<UserOutlined style={{ color: '#fff' }} />}>
            <Link to="/storesettings">{!isMobileView && 'Store Settings'}</Link>
          </Menu.Item>
            <Menu.Item key="3" icon={<AppstoreOutlined style={{ color: '#fff' }} />}>
            <Link to="/addcoupens">{!isMobileView && 'Add Coupons'}</Link>
          </Menu.Item>
          <Menu.Item key="4" icon={<AppstoreOutlined style={{ color: '#fff' }} />}>
            <Link to="/get/all/vendor/coupens">{!isMobileView && 'Coupens & Deals'}</Link>
          </Menu.Item>
          <Menu.Item key="5" icon={<WalletOutlined style={{ color: '#fff' }} />}>
            <Link to="/contactus">{!isMobileView && 'Help & Support'}</Link>
          </Menu.Item>
         <Menu.Item
        key="6"
        className="logout-item"
        icon={<LogoutOutlined style={{ color: '#fff' }} />}
        onClick={handleLogout}
      >
        Logout
      </Menu.Item>


        </Menu>
      </Sider>
      <Layout>
        <Header className="header">
          <div
            style={{
              margin: '0 0 0 16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <h4 style={{ margin: 0, flex: 1 }}></h4>
        
          </div>
        </Header>
        <Content style={{ overflow: 'auto', height: 'calc(100vh - 64px)' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default HomepageComponent;
