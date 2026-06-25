
import { GuestList } from '../schema/GuestList'

export interface T_guestUpdateGuest_headers {
  authorization: string
}
export interface T_guestUpdateGuest_path {
  guest_id: string
}
export interface T_guestUpdateGuest_body {
  name: string
}



export type T_guestUpdateGuest = (request: {
  headers: T_guestUpdateGuest_headers
  path: T_guestUpdateGuest_path
  body: T_guestUpdateGuest_body
}, base_url?: string) => Promise<GuestList>;

export const method = 'patch';
export const url_path = '/guests/:guest_id';
export const alias = 'guestUpdateGuest';
export const is_streaming = false;
