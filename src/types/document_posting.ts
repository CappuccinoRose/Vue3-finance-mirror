// src/types/document_posting.ts

// --- 枚举定义 ---

export enum DocumentType {
  INVOICE = 'invoice',
  PURCHASE_BILL = 'purchase_bill',
}

// --- API 请求模型 ---

export interface DocumentPostingBase {
  document_type: DocumentType
  document_guid: string
}

export interface DocumentPostingCreate extends DocumentPostingBase {}

// --- API 响应模型 ---

export interface DocumentPostingResponse {
  success: boolean
  message: string
  transaction_guid: string | null
  document_guid: string
}
