import type { AdminFaqItem } from '../schema/AdminFaqItem'

export interface AdminFaqList {
  total: number
  data: AdminFaqItem[]
}