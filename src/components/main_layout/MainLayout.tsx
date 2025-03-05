import React, { useState } from 'react';
import { Layout, Menu, Button, Modal, Avatar } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  FileAddOutlined,
  UnorderedListOutlined,
  LoginOutlined,
  LogoutOutlined,
  SunOutlined,
  MoonOutlined
} from '@ant-design/icons';
import { useNavigate, Routes, Route } from 'react-router';
import BlogEdit from '../../pages/blog_edit/BlogEdit.tsx';
import BlogList from '../../pages/blog_list/BlogList.tsx';
import BlogView from '../../pages/blog_view/BlogView.tsx';
import AuthIn from "../Auth/AuthIn.tsx";
import { useAuth } from '../../contexts/AuthContext.tsx';

import logo from '../../assets/logo.jpeg';

const { Header, Sider, Content } = Layout;

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
  const { isAuthenticated, user, logout } = useAuth();

  function showModal() {
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

  const handleLogout = () => {
    logout();
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
          <AuthIn onClose={handleCancel} />
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
              isAuthenticated ?
                <>
                  <Button className={"logout-button"} type="primary" onClick={handleLogout}>
                    <LogoutOutlined />
                    注销
                  </Button>
                  <Avatar className={"avatar"} size={32} src={logo} />
                  <span className="username">{user?.username}</span>
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

export default MainLayout;