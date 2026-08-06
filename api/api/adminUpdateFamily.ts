
import type { AdminFamilyItem } from '../schema/AdminFamilyItem'

export interface T_adminUpdateFamily_headers {
  authorization: string
}
export interface T_adminUpdateFamily_path {
  family_id: string
}
export interface T_adminUpdateFamily_body {
  fam_name?: string
  pax_allowed?: number
  after_party_allowed?: boolean
  rsvp_manager_id?: number
}



export type T_adminUpdateFamily = (request: {
  headers: T_adminUpdateFamily_headers
  path: T_adminUpdateFamily_path
  body: T_adminUpdateFamily_body
}, base_url?: string) => Promise<AdminFamilyItem>;

export const method = 'patch';
export const url_path = '/admin/families/:family_id';
export const alias = 'adminUpdateFamily';
export const is_streaming = false;
