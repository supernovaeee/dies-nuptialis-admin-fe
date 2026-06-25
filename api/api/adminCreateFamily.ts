
import type { AdminFamilyItem } from '../schema/AdminFamilyItem'

export interface T_adminCreateFamily_headers {
  authorization: string
}
export interface T_adminCreateFamily_body {
  fam_name: string
  pax_allowed?: number
  after_party_allowed?: boolean
}



export type T_adminCreateFamily = (request: {
  headers: T_adminCreateFamily_headers
  body: T_adminCreateFamily_body
}, base_url?: string) => Promise<AdminFamilyItem>;

export const method = 'post';
export const url_path = '/admin/families';
export const alias = 'adminCreateFamily';
export const is_streaming = false;
