
import { GuestList } from '../schema/GuestList'

export interface T_guestDeleteGuest_headers {
  authorization: string
}
export interface T_guestDeleteGuest_path {
  guest_id: string
}



export type T_guestDeleteGuest = (request: {
  headers: T_guestDeleteGuest_headers
  path: T_guestDeleteGuest_path
}, base_url?: string) => Promise<GuestList>;

export const method = 'delete';
export const url_path = '/guests/:guest_id';
export const alias = 'guestDeleteGuest';
export const is_streaming = false;
