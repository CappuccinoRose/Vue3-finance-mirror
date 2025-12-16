// src/api/account.ts
import pureApiClient from './client'
import type { Account, AccountCreate, AccountUpdate } from '@/types/account'

const API_PREFIX = '/accounts'

/**
 * 获取科目列表
 * @param parent_guid 父科目GUID，为空则查询根科目
 * @returns Promise<Account[]>
 */
export const getAccounts = (parent_guid?: string | null): Promise<Account[]> => {
  const params = parent_guid ? { parent_guid } : {}
  return pureApiClient.get(API_PREFIX, { params })
}

/**
 * 创建新科目
 * @param data 创建科目的数据
 * @returns Promise<Account>
 */
export const createAccount = (data: AccountCreate): Promise<Account> => {
  return pureApiClient.post(API_PREFIX, data)
}

/**
 * 根据GUID获取科目详情
 * @param guid 科目GUID
 * @returns Promise<Account>
 */
export const getAccountByGuid = (guid: string): Promise<Account> => {
  return pureApiClient.get(`${API_PREFIX}/${guid}`)
}

/**
 * 更新科目
 * @param guid 科目GUID
 * @param data 更新科目的数据
 * @returns Promise<Account>
 */
export const updateAccount = (guid: string, data: AccountUpdate): Promise<Account> => {
  return pureApiClient.put(`${API_PREFIX}/${guid}`, data)
}
