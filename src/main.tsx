import {createRoot} from 'react-dom/client'
import './index.css'
import React, {useEffect, useState} from 'react';
import {
  Layout, Menu, Button, Modal,
  Avatar,
  ConfigProvider, theme, message,
} from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  FileAddOutlined,
  UnorderedListOutlined,
  LoginOutlined,
  SunOutlined,
  MoonOutlined
} from '@ant-design/icons';
import {BrowserRouter as Router, Routes, Route, useNavigate} from 'react-router';
import BlogEdit from './pages/blog_edit/BlogEdit.tsx';
import BlogList from './pages/blog_list/BlogList.tsx';
import BlogView from './pages/blog_view/BlogView.tsx';
import AuthIn from "./components/Auth/AuthIn.tsx";

import logo from './assets/logo.jpeg';
import {AccountInfo} from "./types/auth.ts";
import {authService} from "./services/auth_service.ts";

const {Header, Sider, Content} = Layout;

const App: React.FC = () => {
  const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;//浏览器是否是暗色主题

  const [collapsed, setCollapsed] = useState(true);
  const [isLightTheme, setIsLightTheme] = useState(!prefersDarkMode);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const handleThemeChange = () => {
    setIsLightTheme(!isLightTheme);
  }

  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // 定义主题变化处理函数
    const handleThemeChange = (event: { matches: any; }) => {
      const newIsDarkMode = event.matches;
      console.log(`系统主题变更: 变为${newIsDarkMode ? '深色' : '浅色'}主题`);
      setIsLightTheme(!newIsDarkMode);
      message.info(`检测到系统主题变更为${newIsDarkMode ? '深色' : '浅色'}模式`, 2);
    };

    try {
      // 现代浏览器 API
      if (darkModeMediaQuery.addEventListener) {
        console.log('使用现代事件监听器 API');
        darkModeMediaQuery.addEventListener('change', handleThemeChange);
      } else {
        // 旧版浏览器 API
        console.log('使用旧版事件监听器 API');
        darkModeMediaQuery.addListener(handleThemeChange);
      }

      // 清理函数
      return () => {
        if (darkModeMediaQuery.removeEventListener) {
          darkModeMediaQuery.removeEventListener('change', handleThemeChange);
        } else {
          darkModeMediaQuery.removeListener(handleThemeChange);
        }
      };
    } catch (error) {
      console.error('设置主题监听器时出错:', error);
    }
  }, []);


  return (
    <ConfigProvider
      theme={{
        algorithm: isLightTheme ? theme.defaultAlgorithm : theme.darkAlgorithm
      }}
    >
      <Router>
        <MainLayout
          collapsed={collapsed}
          toggleCollapsed={toggleCollapsed}
          isLightTheme={isLightTheme}
          handleThemeChange={handleThemeChange}
        />
      </Router>
    </ConfigProvider>
  );
};


const MainLayout: React.FC<{
  collapsed: boolean,
  toggleCollapsed: () => void,
  isLightTheme: boolean,
  handleThemeChange: () => void
}> = ({
        collapsed,
        toggleCollapsed,
        isLightTheme,
        handleThemeChange
      }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginSuccess, setIsLoginSuccess] = useState(false);
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);

  function showModal() {
    //先初始化一些状态
    setAccountInfo(null);
    setIsLoginSuccess(false);
    setIsModalOpen(true);
  }

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleMenuClick = (e: any) => {
    if (e.key === '1') {
      navigate('/');
    } else if (e.key === '2') {
      navigate('/blog/create');
    }
  };

  const handleLoginSuccess = (account_info: AccountInfo) => {
    setAccountInfo(account_info);
    setIsLoginSuccess(true);
    console.log("登录成功" + account_info);
  }

  const handleLogout = () => {
    authService.logout();//此函数会向服务器发送注销请求，并且清空localStorage中的token
    setAccountInfo(null);
    setIsLoginSuccess(false);
    console.log("注销成功");
  }

  return (
    <Layout style={{minHeight: '100vh'}}>
      {
        // 登录弹窗
        <Modal
          title="账户管理"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={null}
          maskClosable={false} // 点击遮罩层不关闭
          centered={true} // 垂直居中
        >
          <AuthIn
            onClose={handleCancel}
            handleLoginSuccess={handleLoginSuccess}
          >
          </AuthIn>
        </Modal>
      }
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={toggleCollapsed}
        width={200}
      >
        <div className="logo"/>
        <Menu
          theme="dark"
          defaultSelectedKeys={['1']}
          mode="inline"
          onClick={handleMenuClick}
          items={[
            {key: '1', icon: <UnorderedListOutlined/>, label: 'Blog List'},
            {key: '2', icon: <FileAddOutlined/>, label: 'Create Blog'},
          ]}
        />
      </Sider>
      <Layout className="site-layout">
        <Header className="header site-layout-background" style={{padding: 0}}>
          <Button type="primary" onClick={toggleCollapsed} style={{marginLeft: 16}}>
            {collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
          </Button>

          <div className={"account-div"}>
            <Button className={"theme-button"} type="primary" onClick={handleThemeChange}>
              {isLightTheme ? <SunOutlined/> : <MoonOutlined/>}
            </Button>
            {
              isLoginSuccess ?
                <>
                  <Button className={"logout-button"} type="primary" onClick={handleLogout}>
                    注销
                  </Button>
                  <Avatar className={"avatar"} size={32} src={logo}/>
                </>
                :
                <>
                  <Button className={"login-button"} type="primary" onClick={showModal}>
                    <LoginOutlined/>
                    点击登录！
                  </Button>
                </>
            }
          </div>
        </Header>

        <Content
          style={{
            margin: '0 0 0 0',
            overflow: 'hidden',
            display: 'flex',
          }}
        >
          {/* 将内部容器设置为 flex:1，定义高度并设置 overflow:auto */}
          <div
            className={'route-container'}
            style={{
              padding: 24,
              flex: 1,
              // 减去 header 和 margin 的高度，根据实际情况调整
              height: 'calc(100vh - 112px)',
              overflow: 'auto',
            }}
          >
            <Routes>
              <Route path="/" element={<BlogList/>}/>
              <Route path="/blog/create" element={<BlogEdit isCreate={true}/>}/>
              <Route path="/blog/edit/:id" element={<BlogEdit isCreate={false}/>}/>
              <Route path="/blog/:id" element={<BlogView/>}/>
            </Routes>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};
createRoot(document.getElementById('root')!).render(
  <App/>
)

