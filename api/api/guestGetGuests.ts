
import type { GuestList } from '../schema/GuestList'

export interface T_guestGetGuests_headers {
  authorization: string
}



export type T_guestGetGuests = (request: {
  headers: T_guestGetGuests_headers
}, base_url?: string) => Promise<GuestList>;

export const method = 'get';
export const url_path = '/guests';
export const alias = 'guestGetGuests';
export const is_streaming = false;
