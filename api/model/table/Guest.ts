import type { GuestFamily } from '../../model/table/GuestFamily'

export interface Guest {
  id: number;
  guest_fam_id: number;
  otm_guest_fam_id?: GuestFamily;
  name: string;
  vegetarian: boolean;
  created_at: Date;
  updated_at?: Date;
}