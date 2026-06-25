import type { AdminRsvpItem } from '../schema/AdminRsvpItem'

export interface AdminRsvpList {
  total: number
  data: AdminRsvpItem[]
}