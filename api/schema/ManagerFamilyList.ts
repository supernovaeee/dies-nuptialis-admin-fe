import type { ManagerFamilyItem } from '../schema/ManagerFamilyItem'

export interface ManagerFamilyList {
  manager_name: string
  manager_message?: string
  total: number
  total_guests: number
  data: ManagerFamilyItem[]
}