
import type { DeletedResponse } from '../schema/DeletedResponse'

export interface T_adminDeleteRsvpManager_headers {
  authorization: string
}
export interface T_adminDeleteRsvpManager_path {
  manager_id: string
}



export type T_adminDeleteRsvpManager = (request: {
  headers: T_adminDeleteRsvpManager_headers
  path: T_adminDeleteRsvpManager_path
}, base_url?: string) => Promise<DeletedResponse>;

export const method = 'delete';
export const url_path = '/admin/rsvp-managers/:manager_id';
export const alias = 'adminDeleteRsvpManager';
export const is_streaming = false;
