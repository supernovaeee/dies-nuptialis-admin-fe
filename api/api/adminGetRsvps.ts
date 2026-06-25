
import type { AdminRsvpList } from '../schema/AdminRsvpList'

export interface T_adminGetRsvps_headers {
  authorization: string
}
export interface T_adminGetRsvps_query {
  limit?: number
  offset?: number
}



export type T_adminGetRsvps = (request: {
  headers: T_adminGetRsvps_headers
  query: T_adminGetRsvps_query
}, base_url?: string) => Promise<AdminRsvpList>;

export const method = 'get';
export const url_path = '/admin/rsvps';
export const alias = 'adminGetRsvps';
export const is_streaming = false;
