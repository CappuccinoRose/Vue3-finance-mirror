//src/types/vendor.ts

export interface Vendor {
  guid: string
  name: string
  id: string | null
  notes: string | null
  active: boolean
}

export type VendorCreatePayload = Omit<Vendor, 'guid'>
export type VendorUpdatePayload = Partial<VendorCreatePayload>
