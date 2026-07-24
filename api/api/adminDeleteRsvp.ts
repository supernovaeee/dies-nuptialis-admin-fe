
import type { DeletedResponse } from '../schema/DeletedResponse'

export interface T_adminDeleteRsvp_headers {
  authorization: string
}
export interface T_adminDeleteRsvp_path {
  rsvp_id: string
}



export type T_adminDeleteRsvp = (request: {
  headers: T_adminDeleteRsvp_headers
  path: T_adminDeleteRsvp_path
}, base_url?: string) => Promise<DeletedResponse>;

export const method = 'delete';
export const url_path = '/admin/rsvps/:rsvp_id';
export const alias = 'adminDeleteRsvp';
export const is_streaming = false;
