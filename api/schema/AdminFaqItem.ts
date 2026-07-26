

export interface AdminFaqItem {
  id: number
  question: string
  answer: string
  archived: boolean
  created_at: string
  updated_at?: string
}