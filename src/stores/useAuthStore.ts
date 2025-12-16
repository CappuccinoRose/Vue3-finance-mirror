import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/api/auth'
import { pureApiClient } from '@/api'
import type { LoginRequest, RegisterRequest, AuthResponse } from '@/types/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthResponse['user'] | null>(null)
  const token = ref<string | null>(localStorage.getItem('access_token'))
  const isLoading = ref(false)

  const isLoggedIn = computed(() => !!token.value)

  const login = async (credentials: LoginRequest) => {
    isLoading.value = true
    try {
      const response = await authApi.login(credentials)
      const { access_token, user: userData } = response

      token.value = access_token
      user.value = userData
      localStorage.setItem('access_token', access_token)

      pureApiClient.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    } catch (error: any) {
      console.error('Login failed:', error)
      throw new Error(error.response?.data?.detail || '登录失败')
    } finally {
      isLoading.value = false
    }
  }

  const register = async (userData: RegisterRequest) => {
    isLoading.value = true
    try {
      const response = await authApi.register(userData)
      const { access_token, user: registeredUser } = response

      token.value = access_token
      user.value = registeredUser
      localStorage.setItem('access_token', access_token)

      pureApiClient.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    } catch (error: any) {
      console.error('Register failed:', error)
      throw new Error(error.response?.data?.detail || '注册失败')
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('access_token')
    delete pureApiClient.defaults.headers.common['Authorization']
  }

  const fetchCurrentUser = async () => {
    if (!token.value) return
    isLoading.value = true
    try {
      const response = await authApi.getCurrentUser()
      user.value = response
    } catch (error) {
      logout()
    } finally {
      isLoading.value = false
    }
  }

  return {
    user,
    token,
    isLoading,
    isLoggedIn,
    login,
    register,
    logout,
    fetchCurrentUser,
  }
})
