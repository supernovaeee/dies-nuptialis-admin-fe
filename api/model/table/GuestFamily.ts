
export interface GuestFamily {
  id: number;
  fam_name: string;
  invite_code: string;
  pax_allowed: number;
  after_party_allowed: boolean;
  created_at: Date;
  updated_at?: Date;
}