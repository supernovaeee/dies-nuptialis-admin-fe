import type { FaqItem } from '../schema/FaqItem'

export interface FaqList {
  total: number
  data: FaqItem[]
}