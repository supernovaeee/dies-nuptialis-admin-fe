import type { GuestItem } from '../schema/GuestItem'

export interface AdminFamilyItem {
  id: number
  fam_name: string
  invite_code: string
  pax_allowed: number
  after_party_allowed: boolean
  guests: GuestItem[]
  has_rsvp: boolean
  rsvp_status: string
  has_letter: boolean
  rsvp_manager_id?: number
  rsvp_manager_name?: string
}