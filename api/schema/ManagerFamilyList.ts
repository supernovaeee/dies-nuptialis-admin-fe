import type { ManagerFamilyItem } from '../schema/ManagerFamilyItem'

export interface ManagerFamilyList {
  manager_name: string
  data: ManagerFamilyItem[]
}