// src/utils/constants.ts

/**
 * 会计科目类型
 */
export const ACCOUNT_TYPES = {
  ASSET: 'ASSET', // 资产
  LIABILITY: 'LIABILITY', // 负债
  EQUITY: 'EQUITY', // 权益
  REVENUE: 'REVENUE', // 收入
  EXPENSE: 'EXPENSE', // 费用
} as const

/**
 * 会计科目类型显示名称映射
 */
export const ACCOUNT_TYPE_LABELS: Record<string, string> = {
  [ACCOUNT_TYPES.ASSET]: '资产',
  [ACCOUNT_TYPES.LIABILITY]: '负债',
  [ACCOUNT_TYPES.EQUITY]: '所有者权益',
  [ACCOUNT_TYPES.REVENUE]: '收入',
  [ACCOUNT_TYPES.EXPENSE]: '费用',
}

/**
 * 借贷方向
 */
export const DEBIT_CREDIT = {
  DEBIT: 'DEBIT', // 借方
  CREDIT: 'CREDIT', // 贷方
} as const

/**
 * 借贷方向显示名称映射
 */
export const DEBIT_CREDIT_LABELS: Record<string, string> = {
  [DEBIT_CREDIT.DEBIT]: '借',
  [DEBIT_CREDIT.CREDIT]: '贷',
}

/**
 * 默认分页配置
 */
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
} as const

/**
 * API 请求状态码
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const
