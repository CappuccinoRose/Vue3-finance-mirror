// src/api/document_posting.ts

import pureApiClient from './client'
import type { DocumentPostingCreate, DocumentPostingResponse } from '@/types/document_posting'

/**
 * 对指定的业务单据执行过账操作
 * @param data 过账请求数据
 * @returns 过账操作结果
 */
export const postDocument = (data: DocumentPostingCreate) => {
  return pureApiClient.post<DocumentPostingResponse>('/document-posting/', data)
}
