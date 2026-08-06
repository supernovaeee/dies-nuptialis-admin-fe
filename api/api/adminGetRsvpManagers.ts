
import type { AdminRsvpManagerList } from '../schema/AdminRsvpManagerList'

export interface T_adminGetRsvpManagers_headers {
  authorization: string
}
export interface T_adminGetRsvpManagers_query {
  limit?: number
  offset?: number
  q?: string
}



export type T_adminGetRsvpManagers = (request: {
  headers: T_adminGetRsvpManagers_headers
  query: T_adminGetRsvpManagers_query
}, base_url?: string) => Promise<AdminRsvpManagerList>;

export const method = 'get';
export const url_path = '/admin/rsvp-managers';
export const alias = 'adminGetRsvpManagers';
export const is_streaming = false;
