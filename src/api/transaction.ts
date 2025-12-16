// src/api/transaction.ts
import pureApiClient from './client'
import type { Transaction, TransactionCreate, TransactionUpdate } from '@/types/transaction'

const API_PREFIX = '/accounts/transactions'

/**
 * 获取交易列表
 * @param skip 跳过的条数
 * @param limit 返回的最大条数
 * @returns Promise<Transaction[]>
 */
export const getTransactions = (skip: number = 0, limit: number = 100): Promise<Transaction[]> => {
  return pureApiClient.get(API_PREFIX, { params: { skip, limit } })
}

/**
 * 创建新交易
 * @param data 创建交易的数据
 * @returns Promise<Transaction>
 */
export const createTransaction = (data: TransactionCreate): Promise<Transaction> => {
  return pureApiClient.post(API_PREFIX, data)
}

/**
 * 根据GUID获取交易详情
 * @param guid 交易GUID
 * @returns Promise<Transaction>
 */
export const getTransactionByGuid = (guid: string): Promise<Transaction> => {
  return pureApiClient.get(`${API_PREFIX}/${guid}`)
}
