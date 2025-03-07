const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

interface ApiRequestOptions extends RequestInit {
  skipAuth?: boolean;
}

export interface ApiResult<T = any> {
  success: boolean;
  value?: T;
  error?: string;
}

export async function fetchApi<T = any>(endpoint: string, options: ApiRequestOptions = {}): Promise<ApiResult<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (!options.skipAuth) {
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  try {
    const response = await fetch(url, {...options, headers});
    if (response.ok) {
      const contentType = response.headers.get('content-type');
      const data = contentType && contentType.includes('application/json') ? await response.json() : undefined;
      return {success: true, value: data};
    } else {
      const errorData = await response.json();
      return {success: false, error: errorData.message || '请求失败'};
    }
  } catch (error) {
    return {success: false, error: error instanceof Error ? error.message : '请求失败'};
  }
}