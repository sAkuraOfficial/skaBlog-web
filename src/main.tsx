import {createRoot} from 'react-dom/client'
import './index.css'
import React, { useState, useEffect } from 'react';
import { ConfigProvider, theme } from 'antd';
import { BrowserRouter as Router } from 'react-router';
import { AuthProvider } from './contexts/AuthContext';
import { MessageProvider } from './contexts/MessageContext';
import AppContent from './AppContent';

// 获取系统当前主题 - 辅助函数
const getSystemThemePreference = (): boolean => {
  return window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches;
};

const App: React.FC = () => {
  // 使用系统主题作为初始值
  const prefersDarkMode = getSystemThemePreference();
  const [isLightTheme, setIsLightTheme] = useState(!prefersDarkMode);

  // 简化版的主题监听逻辑 - 不包含消息通知功能
  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // 定义主题变化处理函数 - 不发送通知，只更新状态
    const handleSystemThemeChange = (event: { matches: boolean }) => {
      const newIsDarkMode = event.matches;
      console.log(`系统主题变更: 变为${newIsDarkMode ? '深色' : '浅色'}主题`);
      setIsLightTheme(!newIsDarkMode);
    };

    try {
      // 现代浏览器 API
      if (darkModeMediaQuery.addEventListener) {
        darkModeMediaQuery.addEventListener('change', handleSystemThemeChange);
      } else {
        // 旧版浏览器 API
        darkModeMediaQuery.addListener(handleSystemThemeChange);
      }

      // 清理函数
      return () => {
        if (darkModeMediaQuery.removeEventListener) {
          darkModeMediaQuery.removeEventListener('change', handleSystemThemeChange);
        } else {
          darkModeMediaQuery.removeListener(handleSystemThemeChange);
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
      <MessageProvider>
        <AuthProvider>
          <Router>
            <AppContent
              isLightTheme={isLightTheme}
              setIsLightTheme={setIsLightTheme}
            />
          </Router>
        </AuthProvider>
      </MessageProvider>
    </ConfigProvider>
  );
};

createRoot(document.getElementById('root')!).render(<App />);