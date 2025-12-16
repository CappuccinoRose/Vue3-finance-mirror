// src/api/auth.ts

import pureApiClient from './client'
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  PasswordResetRequest,
  PasswordResetRequestResponse,
  PasswordResetConfirm,
} from '@/types/auth'

/**
 * 认证相关 API 接口
 */
export const authApi = {
  /**
   * 用户登录
   * @param data 登录凭据
   */
  login: (data: LoginRequest) => {
    const formData = new URLSearchParams()
    formData.append('username', data.username)
    formData.append('password', data.password)

    return pureApiClient.post<AuthResponse>('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
  },

  /**
   * 用户注册
   * @param data 注册信息
   */
  register: (data: RegisterRequest) => pureApiClient.post<AuthResponse>('/auth/register', data),

  /**
   * 获取当前登录用户信息
   */
  getCurrentUser: (): Promise<AuthResponse['user']> =>
    pureApiClient.get<AuthResponse['user']>('/auth/me'),

  /**
   * 请求密码重置
   * @param data 包含邮箱的请求体
   */
  requestPasswordReset: (data: PasswordResetRequest) =>
    pureApiClient.post<PasswordResetRequestResponse>('/auth/password-reset/request', data),

  /**
   * 确认密码重置
   * @param data 包含新密码和令牌的请求体
   */
  confirmPasswordReset: (data: PasswordResetConfirm) =>
    pureApiClient.post<void>('/auth/password-reset/confirm', data),
}
