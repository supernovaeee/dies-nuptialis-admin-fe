
import { RsvpDetail } from '../schema/RsvpDetail'

export interface T_submitRsvp_headers {
  authorization: string
}
export interface T_submitRsvp_body {
  attending_main_status: string
  attending_after_party?: string
  vegetarian?: boolean
  special_notes?: string
  email?: string
}



export type T_submitRsvp = (request: {
  headers: T_submitRsvp_headers
  body: T_submitRsvp_body
}, base_url?: string) => Promise<RsvpDetail>;

export const method = 'post';
export const url_path = '/rsvp';
export const alias = 'submitRsvp';
export const is_streaming = false;
