
import type { AdminRsvpManagerItem } from '../schema/AdminRsvpManagerItem'

export interface T_adminCreateRsvpManager_headers {
  authorization: string
}
export interface T_adminCreateRsvpManager_body {
  name: string
  message?: string
}



export type T_adminCreateRsvpManager = (request: {
  headers: T_adminCreateRsvpManager_headers
  body: T_adminCreateRsvpManager_body
}, base_url?: string) => Promise<AdminRsvpManagerItem>;

export const method = 'post';
export const url_path = '/admin/rsvp-managers';
export const alias = 'adminCreateRsvpManager';
export const is_streaming = false;
