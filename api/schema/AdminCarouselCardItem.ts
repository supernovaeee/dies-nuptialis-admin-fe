

export interface AdminCarouselCardItem {
  id: number
  title?: string
  image_url?: string
  content?: string
  sort_order: number
  archived: boolean
  created_at: string
  updated_at?: string
}