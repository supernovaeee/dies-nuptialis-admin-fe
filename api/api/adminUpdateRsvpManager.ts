
import type { AdminRsvpManagerItem } from '../schema/AdminRsvpManagerItem'

export interface T_adminUpdateRsvpManager_headers {
  authorization: string
}
export interface T_adminUpdateRsvpManager_path {
  manager_id: string
}
export interface T_adminUpdateRsvpManager_body {
  name?: string
  message?: string
  regenerate_passcode?: boolean
}



export type T_adminUpdateRsvpManager = (request: {
  headers: T_adminUpdateRsvpManager_headers
  path: T_adminUpdateRsvpManager_path
  body: T_adminUpdateRsvpManager_body
}, base_url?: string) => Promise<AdminRsvpManagerItem>;

export const method = 'patch';
export const url_path = '/admin/rsvp-managers/:manager_id';
export const alias = 'adminUpdateRsvpManager';
export const is_streaming = false;
