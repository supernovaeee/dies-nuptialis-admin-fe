import type { RSVPManager } from '../../model/table/RSVPManager'

export interface GuestFamily {
  id: number;
  fam_name: string;
  invite_code: string;
  pax_allowed: number;
  after_party_allowed: boolean;
  rsvp_manager_id?: number;
  otm_rsvp_manager_id?: RSVPManager;
  created_at: Date;
  updated_at?: Date;
}