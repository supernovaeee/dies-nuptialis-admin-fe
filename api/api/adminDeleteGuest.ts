
import type { DeletedResponse } from '../schema/DeletedResponse'

export interface T_adminDeleteGuest_headers {
  authorization: string
}
export interface T_adminDeleteGuest_path {
  guest_id: string
}



export type T_adminDeleteGuest = (request: {
  headers: T_adminDeleteGuest_headers
  path: T_adminDeleteGuest_path
}, base_url?: string) => Promise<DeletedResponse>;

export const method = 'delete';
export const url_path = '/admin/guests/:guest_id';
export const alias = 'adminDeleteGuest';
export const is_streaming = false;
