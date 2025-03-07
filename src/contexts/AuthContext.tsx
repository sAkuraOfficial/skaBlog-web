import React, {createContext, useContext, useEffect, useState} from 'react';
import {AccountInfo, AuthStatus, FetchResponse, LoginResponse, RegisterResponse} from '../types/auth';
import {authService} from '../services/auth_service.ts';

interface AuthContextType {
  isAuthenticated: boolean;
  user: {
    username: string | null;
    roles: string[] | null;
  } | null;
// { username: string | null; roles: string[] | null } | null
  login: (credentials: AccountInfo) => Promise<FetchResponse<LoginResponse>>;
  logout: () => void;
  register: (credentials: AccountInfo) => Promise<FetchResponse<RegisterResponse>>;
  status: AuthStatus;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<{ username: string | null; roles: string[] | null } | null>(null);
  const [status, setStatus] = useState<AuthStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

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

  const login = async (credentials: AccountInfo): Promise<FetchResponse<LoginResponse>> => {
    try {
      setStatus('loading');
      clearError();
      const response = await authService.login(credentials);
      if (response.success) {
        setIsAuthenticated(true);
        setUser({
          username: response.data ? response.data.username : null,
          roles: response.data?.roles || [],
        });
        setStatus('success');
      } else {
        setStatus('error');
        setError(response.error || '登录失败，请稍后重试');
      }
      return response;
    } catch (error) {
      setStatus('error');
      const errorMessage = error instanceof Error ? error.message : '未知错误，请稍后重试';
      setError(errorMessage);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
    setStatus('idle');
  };

  const register = async (credentials: AccountInfo): Promise<FetchResponse<RegisterResponse>> => {
    try {
      setStatus('loading');
      clearError();
      const response = await authService.register(credentials);
      if (response.success) {
        setStatus('reg_success');
      } else {
        setStatus('error');
        setError(response.error || '注册失败，请稍后重试');
      }
      return response;
    } catch (error) {
      setStatus('error');
      const errorMessage = error instanceof Error ? error.message : '注册失败，请稍后重试';
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
    clearError,
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