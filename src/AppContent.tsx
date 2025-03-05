import React, {useState, useEffect} from 'react';
import MainLayout from './components/main_layout/MainLayout.tsx';
import {useMessage} from './contexts/MessageContext';

interface AppContentProps {
  isLightTheme: boolean;
  setIsLightTheme: React.Dispatch<React.SetStateAction<boolean>>;
}

const AppContent: React.FC<AppContentProps> = ({isLightTheme, setIsLightTheme}) => {
  const messageApi = useMessage(); // 在MessageProvider内部使用
  const [collapsed, setCollapsed] = useState(true);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const handleThemeChange = () => {
    setIsLightTheme(!isLightTheme);
  };

  // 监听主题变化并发送通知
  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleSystemThemeChange = (event: { matches: boolean }) => {
      const newIsDarkMode = event.matches;
      // 只负责发送通知，主题状态更新在App组件中进行
      messageApi.open({
        type: 'info',
        content: `检测到系统主题变更为${newIsDarkMode ? '深色' : '浅色'}模式`,
        duration: 2
      });
    };

    try {
      if (darkModeMediaQuery.addEventListener) {
        darkModeMediaQuery.addEventListener('change', handleSystemThemeChange);
      } else {
        darkModeMediaQuery.addListener(handleSystemThemeChange);
      }

      return () => {
        if (darkModeMediaQuery.removeEventListener) {
          darkModeMediaQuery.removeEventListener('change', handleSystemThemeChange);
        } else {
          darkModeMediaQuery.removeListener(handleSystemThemeChange);
        }
      };
    } catch (error) {
      console.error('设置主题通知监听器时出错:', error);
    }
  }, [messageApi]);

  return (
    <MainLayout
      collapsed={collapsed}
      toggleCollapsed={toggleCollapsed}
      isLightTheme={isLightTheme}
      handleThemeChange={handleThemeChange}
    />
  );
};

export default AppContent;