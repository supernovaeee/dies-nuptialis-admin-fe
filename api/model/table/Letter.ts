import type { GuestFamily } from '../../model/table/GuestFamily'

export interface Letter {
  id: number;
  id_family: number;
  otm_id_family?: GuestFamily;
  letter_text?: string;
  created_at: Date;
  updated_at?: Date;
}