// src/utils/periodClosingAdapter.ts

import type { PeriodClosing, Transaction } from '@/types/period_closing'

const CLOSING_DESCRIPTION_PREFIX = '[CLOSING-TASK]'

const EMPLOYEE_MAP: Record<string, { username: string; id: string }> = {
  'emp-admin-guid': { username: 'admin', id: 'E001' },
  'emp-finance-001-guid': { username: 'zhang.wei', id: 'E002' },
  'emp-finance-002-guid': { username: 'li.na', id: 'E003' },
  'emp-finance-003-guid': { username: 'wang.qiang', id: 'E004' },
  'emp-sales-001-guid': { username: 'zhao.lei', id: 'E005' },
  'emp-sales-002-guid': { username: 'qian.min', id: 'E006' },
  'emp-it-001-guid': { username: 'sun.feng', id: 'E007' },
  'emp-it-002-guid': { username: 'zhou.jie', id: 'E008' },
}

/**
 * 解析后端返回的 Transaction 对象，转换为前端可用的 PeriodClosing 对象
 * @param transaction 从后端API获取的单个Transaction对象
 * @returns 转换后的PeriodClosing对象，如果不是结转任务或解析失败则返回null
 */
export function adaptTransactionToClosing(transaction: Transaction): PeriodClosing | null {
  if (!transaction.description || !transaction.description.startsWith(CLOSING_DESCRIPTION_PREFIX)) {
    return null
  }

  try {
    const jsonString = transaction.description.substring(CLOSING_DESCRIPTION_PREFIX.length).trim()
    const meta = JSON.parse(jsonString)
    const owner = meta.owner_guid ? EMPLOYEE_MAP[meta.owner_guid] : null
    const owner_name = owner ? owner.username : '未知用户'

    return {
      guid: transaction.guid,
      closing_type: meta.type,
      period_end_date: `${meta.period}-01`,
      status: meta.status,
      error_message: meta.error_message || null,
      post_transaction_guid: meta.status === 'completed' ? transaction.guid : null,
      created_at: transaction.enter_date,
      updated_at: transaction.enter_date,
      //设置操作人姓名
      owner_name: owner_name,
    }
  } catch (error) {
    console.error('Failed to parse closing task description:', transaction.description, error)
    return null
  }
}
