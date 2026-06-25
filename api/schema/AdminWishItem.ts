

export interface AdminWishItem {
  id: number
  family_id: number
  fam_name: string
  guest_given_name?: string
  message_text: string
  image_url?: string
  status: string
  created_at: string
}