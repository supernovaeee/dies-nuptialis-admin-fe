
import { GuestList } from '../schema/GuestList'

export interface T_guestAddGuest_headers {
  authorization: string
}
export interface T_guestAddGuest_body {
  name: string
}



export type T_guestAddGuest = (request: {
  headers: T_guestAddGuest_headers
  body: T_guestAddGuest_body
}, base_url?: string) => Promise<GuestList>;

export const method = 'post';
export const url_path = '/guests';
export const alias = 'guestAddGuest';
export const is_streaming = false;
