import {createRoot} from 'react-dom/client'
import './index.css'
import React, {useEffect, useState} from 'react';
import {
  ConfigProvider, theme, message,
} from 'antd';

import {BrowserRouter as Router} from 'react-router';


import {AuthProvider} from "./contexts/AuthContext.tsx";
import MainLayout from "./components/main_layout/MainLayout.tsx";

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
      <AuthProvider>
        <Router>
          <MainLayout
            collapsed={collapsed}
            toggleCollapsed={toggleCollapsed}
            isLightTheme={isLightTheme}
            handleThemeChange={handleThemeChange}
          />
        </Router>
      </AuthProvider>
    </ConfigProvider>
  );
};



createRoot(document.getElementById('root')!).render(
  <App/>
)

