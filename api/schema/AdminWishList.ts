import type { AdminWishItem } from '../schema/AdminWishItem'

export interface AdminWishList {
  total: number
  data: AdminWishItem[]
}