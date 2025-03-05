import {fetchApi} from './api';
import {AccountInfo, LoginResponse, RegisterResponse} from '../types/auth';

/**
 * 认证相关服务
 */
export const authService = {
  /**
   * 用户登录
   */
  login: async (credentials: AccountInfo): Promise<LoginResponse> => {
    const data = await fetchApi<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
      skipAuth: true // 明确指定跳过添加token
    });

    // 登录成功后存储用户信息
    localStorage.setItem('token', data.token);
    localStorage.setItem('username', data.username);
    localStorage.setItem('roles', data.roles.join(','));

    return data;
  },

  /**
   * 用户注册
   */
  register: async (credentials: AccountInfo): Promise<RegisterResponse> => {
    return await fetchApi<RegisterResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(credentials),
      skipAuth: true // 明确指定跳过添加token
    });
  },

  /**
   * 注销登录
   */
  logout: (): void => {
    // 可以选择调用注销API
    fetchApi('/auth/logout', {
      method: 'POST',
      // 这里不使用skipAuth，因为注销需要验证身份
    }).catch(err => console.error('注销失败', err));

    // 清除本地存储
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('roles');
  }
};