import { GuestFamily } from '../../model/table/GuestFamily'
import { RSVPStatus } from '../../model/enum/RSVPStatus'

export interface RSVP {
  id: number;
  id_family: number;
  otm_id_family?: GuestFamily;
  attending_main_status: RSVPStatus;
  attending_after_party?: RSVPStatus;
  vegetarian?: boolean;
  special_notes?: string;
  email?: string;
  submitted_at: Date;
}