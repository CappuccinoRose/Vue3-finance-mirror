// src/stores/useDocumentPostingStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { DocumentPostingCreate, DocumentPostingResponse } from '@/types/document_posting'
import { postDocument } from '@/api/document_posting'

export const useDocumentPostingStore = defineStore('documentPosting', () => {
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const executePosting = async (payload: DocumentPostingCreate) => {
    isLoading.value = true
    error.value = null
    try {
      const response = await postDocument(payload)
      return response
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || '过账失败，请稍后再试。'
      error.value = errorMessage
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    error,
    executePosting,
  }
})
