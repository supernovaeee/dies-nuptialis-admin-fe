
import type { RsvpDetail } from '../schema/RsvpDetail'

export interface T_getRsvp_headers {
  authorization: string
}



export type T_getRsvp = (request: {
  headers: T_getRsvp_headers
}, base_url?: string) => Promise<RsvpDetail>;

export const method = 'get';
export const url_path = '/rsvp';
export const alias = 'getRsvp';
export const is_streaming = false;
