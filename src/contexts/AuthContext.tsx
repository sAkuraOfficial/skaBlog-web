import React, {createContext, useContext, useEffect, useState} from 'react';
import {AccountInfo, AuthStatus, LoginResponse, RegisterResponse} from '../types/auth';
import {authService} from '../services/auth_service';

interface AuthContextType {
  isAuthenticated: boolean;
  user: {
    username: string;
    roles: string[];
  } | null;
  login: (credentials: AccountInfo) => Promise<LoginResponse>; // 返回数据以便组件使用
  logout: () => void;
  register: (credentials: AccountInfo) => Promise<RegisterResponse>;
  status: AuthStatus;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<{ username: string; roles: string[] } | null>(null);
  const [status, setStatus] = useState<AuthStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  // 清除错误信息
  const clearError = () => setError(null);

  // 检查用户是否已登录
  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const rolesString = localStorage.getItem('roles');

    if (token && username && rolesString) {
      const roles = rolesString.split(',');
      setIsAuthenticated(true);
      setUser({username, roles});
    }
  }, []);

  const login = async (credentials: AccountInfo): Promise<LoginResponse> => {
    try {
      setStatus('loading');
      clearError();
      const response = await authService.login(credentials);
      setIsAuthenticated(true);
      setUser({
        username: response.username,
        roles: response.roles
      });
      setStatus('success');
      return response; // 返回响应，让组件显示成功消息
    } catch (error) {
      setStatus('error');
      const errorMessage = error instanceof Error
        ? error.message
        : '未知错误，请稍后重试';
      setError(errorMessage);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
    setStatus('idle');
    // 不再在这里调用 message.success
  };

  const register = async (credentials: AccountInfo) => {
    try {
      setStatus('loading');
      clearError();
      const response = await authService.register(credentials);
      setStatus('reg_success');
      return response; // 返回响应，让组件显示成功消息
    } catch (error) {
      setStatus('error');
      const errorMessage = error instanceof Error
        ? error.message
        : '注册失败，请稍后重试';
      setError(errorMessage);
      throw error;
    }
  };


  const value: AuthContextType = {
    isAuthenticated,
    user,
    login,
    logout,
    register,
    status,
    error,
    clearError
  };

  //使用AccountInfo类型
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );

};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};