// src/composables/useDocumentPosting.ts

import { useDocumentPostingStore } from '@/stores/useDocumentPostingStore'
import type { DocumentPostingCreate, DocumentPostingResponse } from '@/types/document_posting'
import { ElMessage } from 'element-plus'

export const useDocumentPosting = () => {
  const documentPostingStore = useDocumentPostingStore()

  const postDocumentAndNotify = async (
    payload: DocumentPostingCreate,
  ): Promise<DocumentPostingResponse | null> => {
    try {
      const result = await documentPostingStore.executePosting(payload)
      ElMessage({
        type: 'success',
        message: result.message,
      })
      return result
    } catch (error) {
      ElMessage({
        type: 'error',
        message: documentPostingStore.error || '操作失败',
      })
      return null
    }
  }

  return {
    isLoading: documentPostingStore.isLoading,
    postDocumentAndNotify,
  }
}
