// src/types/account.ts

/**
 * 会计科目类型枚举
 * 用于前端逻辑判断和快捷选择
 */
export type AccountType = 'balance_sheet' | 'income_statement' | 'cash_flow' | 'other'

/**
 * 会计科目基础模型
 * 对应后端 AccountBase
 */
export interface AccountBase {
  name: string
  account_type: string // 后端原始的科目类型字符串
  parent_guid?: string | null
  code?: string | null
  description?: string | null
  hidden: boolean
  placeholder: boolean
}

/**
 * 创建会计科目请求模型
 * 对应后端 AccountCreate
 */
export interface AccountCreate extends AccountBase {}

/**
 * 更新会计科目请求模型
 * 对应后端 AccountUpdate
 */
export interface AccountUpdate {
  name?: string | null
  account_type?: string | null
  parent_guid?: string | null
  code?: string | null
  description?: string | null
  hidden?: boolean | null
  placeholder?: boolean | null
}

/**
 * 会计科目响应模型
 * 对应后端 Account
 */
export interface Account extends AccountBase {
  guid: string
  children: Account[]
  depth?: number // 为前端UI交互添加的深度信息
  hasChildren?: boolean
  type: AccountType
}
