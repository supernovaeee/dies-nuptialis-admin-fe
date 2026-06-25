import type { GuestItem } from '../schema/GuestItem'

export interface AdminFamilyItem {
  id: number
  fam_name: string
  invite_code: string
  pax_allowed: number
  after_party_allowed: boolean
  guests: GuestItem[]
  has_rsvp: boolean
  has_letter: boolean
}