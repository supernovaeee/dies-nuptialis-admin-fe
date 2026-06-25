
import type { GuestItem } from '../schema/GuestItem'

export interface T_adminUpdateGuest_headers {
  authorization: string
}
export interface T_adminUpdateGuest_path {
  guest_id: string
}
export interface T_adminUpdateGuest_body {
  name?: string
  vegetarian?: boolean
}



export type T_adminUpdateGuest = (request: {
  headers: T_adminUpdateGuest_headers
  path: T_adminUpdateGuest_path
  body: T_adminUpdateGuest_body
}, base_url?: string) => Promise<GuestItem>;

export const method = 'patch';
export const url_path = '/admin/guests/:guest_id';
export const alias = 'adminUpdateGuest';
export const is_streaming = false;
