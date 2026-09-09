import type { ManagerFamilyItem } from '../schema/ManagerFamilyItem'

export interface ManagerFamilyList {
  manager_name: string
  manager_message?: string
  total: number
  total_guests: number
  attending_families: number
  attending_guests: number
  declined_families: number
  declined_guests: number
  pending_families: number
  pending_guests: number
  data: ManagerFamilyItem[]
}