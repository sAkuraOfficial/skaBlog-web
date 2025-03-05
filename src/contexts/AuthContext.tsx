import React, {createContext, useContext, useEffect, useState} from 'react';
import {AccountInfo, AuthStatus} from '../types/auth';
import {authService} from '../services/auth_service';
import {message} from 'antd';

interface AuthContextType {
  isAuthenticated: boolean;
  user: {
    username: string;
    roles: string[];
  } | null;
  login: (credentials: AccountInfo) => Promise<void>;
  logout: () => void;
  register: (credentials: AccountInfo) => Promise<void>;
  status: AuthStatus;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<{ username: string; roles: string[] } | null>(null);
  const [status, setStatus] = useState<AuthStatus>('idle');

  // Check if user is already logged in on app initialization
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

  const login = async (credentials: AccountInfo) => {
    try {
      setStatus('loading');
      const response = await authService.login(credentials);
      setIsAuthenticated(true);
      setUser({
        username: response.username,
        roles: response.roles
      });
      setStatus('success');
      message.success(`欢迎回来, ${response.username}!`);
    } catch (error) {
      setStatus('error');
      message.error('登录失败: ' + (error instanceof Error ? error.message : '未知错误'));
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
    message.success('已成功注销');
  };

  const register = async (credentials: AccountInfo) => {
    try {
      setStatus('loading');
      await authService.register(credentials);
      setStatus('reg_success');
      message.success('注册成功，现在可以登录了');
    } catch (error) {
      setStatus('error');
      message.error('注册失败: ' + (error instanceof Error ? error.message : '未知错误'));
      throw error;
    }
  };

  const value = {
    isAuthenticated,
    user,
    login,
    logout,
    register,
    status
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};