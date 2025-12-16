// src/stores/useSlotStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Slot, SlotCreate } from '@/types/slot'

export const useSlotStore = defineStore('slot', () => {
  const slots = ref<Slot[]>([])
  const createSlots = async (slotsData: SlotCreate[]) => {
    console.warn(
      'useSlotStore.createSlots is not intended for system init. Use useSystemConfigStore instead.',
    )
  }

  return {
    slots,
    createSlots,
  }
})
