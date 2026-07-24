
import type { AdminRsvpItem } from '../schema/AdminRsvpItem'

export interface T_adminUpdateRsvp_headers {
  authorization: string
}
export interface T_adminUpdateRsvp_path {
  rsvp_id: string
}
export interface T_adminUpdateRsvp_body {
  attending_main_status?: string
  attending_after_party?: string
  special_notes?: string
  email?: string
}



export type T_adminUpdateRsvp = (request: {
  headers: T_adminUpdateRsvp_headers
  path: T_adminUpdateRsvp_path
  body: T_adminUpdateRsvp_body
}, base_url?: string) => Promise<AdminRsvpItem>;

export const method = 'patch';
export const url_path = '/admin/rsvps/:rsvp_id';
export const alias = 'adminUpdateRsvp';
export const is_streaming = false;
