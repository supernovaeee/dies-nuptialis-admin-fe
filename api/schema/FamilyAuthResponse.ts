import type { GuestItem } from '../schema/GuestItem'
import type { RsvpDetail } from '../schema/RsvpDetail'

export interface FamilyAuthResponse {
  token: string
  family_id: number
  fam_name: string
  invite_code: string
  pax_allowed: number
  after_party_allowed: boolean
  guests: GuestItem[]
  letter_text?: string
  has_rsvp: boolean
  rsvp?: RsvpDetail
}