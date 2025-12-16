// src/utils/account.ts
import type { Account } from '@/types/account'

/**
 * 递归地将树形账户结构扁平化为数组
 * @param accounts 树形账户数组
 * @returns 扁平化的账户数组
 */
export function flattenAccountTree(accounts: Account[]): Account[] {
  let result: Account[] = []
  for (const account of accounts) {
    // 1. 将当前账户添加到结果中
    result.push(account)
    // 2. 如果当前账户有子账户，递归处理它们，并将结果合并
    if (account.children && account.children.length > 0) {
      result = result.concat(flattenAccountTree(account.children))
    }
  }
  return result
}
