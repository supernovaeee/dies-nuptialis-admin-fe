import type { AdminGuestItem } from '../schema/AdminGuestItem'

export interface AdminGuestList {
  total: number
  data: AdminGuestItem[]
}