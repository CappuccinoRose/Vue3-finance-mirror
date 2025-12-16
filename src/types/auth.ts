// src/types/auth.ts

// 登录请求
export interface LoginRequest {
  username: string
  password: string
}

// 注册请求
export interface RegisterRequest {
  username: string
  password: string
  email?: string
}

// 登录/注册成功后的响应
export interface AuthResponse {
  access_token: string
  token_type: string
  user: {
    id: number
    username: string
    active: boolean
  }
}

// 请求重置码
export interface PasswordResetRequest {
  username: string
}

// 请求重置码的响应
export interface PasswordResetRequestResponse {
  reset_code: string
}

// 确认重置密码
export interface PasswordResetConfirm {
  username: string
  reset_code: string
  new_password: string
}
