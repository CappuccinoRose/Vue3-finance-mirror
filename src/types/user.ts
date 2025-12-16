// src/types/user.ts

export interface User {
  guid: string
  username: string
  full_name: string | null
  email: string | null
  is_active: boolean
}

export interface LoginForm {
  username: string
  password: string
}
