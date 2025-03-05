import React, { createContext, useContext } from 'react';
import { message } from 'antd';
import type { MessageInstance } from 'antd/es/message/interface';

// 创建消息 API 的上下文
interface MessageContextType {
  messageApi: MessageInstance;
}

const MessageContext = createContext<MessageContextType | null>(null);

// 包装应用程序的提供者组件
export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messageApi, contextHolder] = message.useMessage();

  return (
    <MessageContext.Provider value={{ messageApi }}>
      {contextHolder}
      {children}
    </MessageContext.Provider>
  );
};

// 使用消息上下文的自定义钩子
export const useMessage = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessage 必须在 MessageProvider 内部使用');
  }
  return context.messageApi;
};