// src/composables/useSystemConfig.ts
import { useSystemConfigStore } from '@/stores/useSystemConfigStore'

export const useSystemConfig = () => {
  const systemConfigStore = useSystemConfigStore()

  return {
    ...systemConfigStore,
  }
}
