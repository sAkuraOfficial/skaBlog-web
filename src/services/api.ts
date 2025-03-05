// Vite 项目中访问环境变量的方式
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// 扩展RequestInit类型来包含我们自定义的选项
interface ApiRequestOptions extends RequestInit {
  skipAuth?: boolean; // 添加这个选项来控制是否跳过认证
}

/**
 * 带认证控制的API请求函数
 */
export async function fetchApi<T>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
  // 构造URL
  const url = `${API_BASE_URL}${endpoint}`;

  // 准备headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  // 只有当skipAuth不为true时，才添加token
  if (!options.skipAuth) {
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  // 发送请求
  const response = await fetch(url, {
    ...options,
    headers,
  });

  // 检查是否是JSON响应
  const contentType = response.headers.get('content-type');
  let data;
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  // 处理错误
  if (!response.ok) {
    if (response.status === 401 && !options.skipAuth) {
      // 可选：处理未授权错误
      // localStorage.removeItem('token');
      // window.location.href = '/login';
    }
    throw new Error(typeof data === 'object' && data.message ? data.message : '请求失败');
  }

  return data as T;
}