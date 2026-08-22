import type { RSVPManager } from '../../model/table/RSVPManager'
import type { RSVPStatus } from '../../model/enum/RSVPStatus'

export interface GuestFamily {
  id: number;
  fam_name: string;
  invite_code: string;
  pax_allowed: number;
  after_party_allowed: boolean;
  rsvp_manager_id?: number;
  otm_rsvp_manager_id?: RSVPManager;
  attending_main_status_marker?: RSVPStatus;
  created_at: Date;
  updated_at?: Date;
}