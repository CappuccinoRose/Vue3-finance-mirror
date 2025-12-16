// src/stores/useSystemConfigStore.ts

import { slotApi } from '@/api/slot'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { SlotCreate } from '@/types/slot'

export const useSystemConfigStore = defineStore('systemConfig', () => {
  const isInitialized = ref<boolean | null>(null)
  const isLoading = ref(false)

  const checkStatus = async () => {
    isLoading.value = true
    try {
      const response = (await slotApi.getSystemStatus()) as unknown as { initialized: boolean }
      isInitialized.value = response.initialized
    } catch (error) {
      console.error('Failed to check system status:', error)
      isInitialized.value = null
    } finally {
      isLoading.value = false
    }
  }

  const initialize = async (slots: SlotCreate[]) => {
    isLoading.value = true
    try {
      console.log('Store 收到的 slots 类型:', typeof slots)
      console.log('Store 收到的 slots 值:', slots)

      await slotApi.initializeSystem(slots)

      isInitialized.value = true
      return true
    } catch (error: any) {
      console.error('Failed to initialize system:', error)
      const detail = error.response?.data?.detail
      if (detail) {
        throw new Error(JSON.stringify(detail))
      } else {
        throw new Error(error.message || '初始化失败')
      }
    } finally {
      isLoading.value = false
    }
  }

  return {
    isInitialized,
    isLoading,
    checkStatus,
    initialize,
  }
})
