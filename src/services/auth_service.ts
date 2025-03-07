import { ApiResult, fetchApi } from './api';
import { AccountInfo, FetchResponse, LoginResponse, RegisterResponse } from '../types/auth';

export const authService = {
  login: async (credentials: AccountInfo): Promise<FetchResponse<LoginResponse>> => {
    const result: ApiResult<LoginResponse> = await fetchApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
      skipAuth: true,
    });

    if (result.success && result.value) {
      localStorage.setItem('token', result.value.token);
      localStorage.setItem('username', result.value.username);
      localStorage.setItem('roles', result.value.roles.join(','));
    }

    return {
      success: result.success,
      data: result.value,
      error: result.error,
    };
  },

  register: async (credentials: AccountInfo): Promise<FetchResponse<RegisterResponse>> => {
    const result = await fetchApi<RegisterResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(credentials),
      skipAuth: true,
    });

    return {
      success: result.success,
      data: result.value,
      error: result.error,
    };
  },

  logout: (): void => {
    fetchApi('/auth/logout', { method: 'POST' }).catch(err => console.error('注销失败', err));
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('roles');
  }
};