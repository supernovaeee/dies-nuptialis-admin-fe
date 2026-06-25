import type { GuestFamily } from '../../model/table/GuestFamily'
import type { WishStatus } from '../../model/enum/WishStatus'

export interface Wish {
  id: number;
  id_family: number;
  otm_id_family?: GuestFamily;
  guest_given_name?: string;
  message_text: string;
  image_url?: string;
  status: WishStatus;
  created_at: Date;
}