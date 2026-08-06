
import type { AdminRsvpManagerItem } from '../schema/AdminRsvpManagerItem'

export interface T_adminGetRsvpManager_headers {
  authorization: string
}
export interface T_adminGetRsvpManager_path {
  manager_id: string
}



export type T_adminGetRsvpManager = (request: {
  headers: T_adminGetRsvpManager_headers
  path: T_adminGetRsvpManager_path
}, base_url?: string) => Promise<AdminRsvpManagerItem>;

export const method = 'get';
export const url_path = '/admin/rsvp-managers/:manager_id';
export const alias = 'adminGetRsvpManager';
export const is_streaming = false;
