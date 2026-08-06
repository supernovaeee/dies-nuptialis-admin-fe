import type { ManagerFamilyItem } from '../schema/ManagerFamilyItem'

export interface ManagerFamilyList {
  manager_name: string
  manager_message?: string
  data: ManagerFamilyItem[]
}