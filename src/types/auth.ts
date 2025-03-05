export interface AccountInfo {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  roles: string[];
  username: string;
}

export interface RegisterResponse {
  id: number;
  username: string;
  active: boolean;
  roles: string[];
  message: string;
}

export type AuthStatus = 'idle' | 'loading' | 'success' | 'error' | 'reg_success';