
import type { AdminGuestList } from '../schema/AdminGuestList'

export interface T_adminGetGuests_headers {
  authorization: string
}
export interface T_adminGetGuests_query {
  limit?: number
  offset?: number
  q?: string
  vegetarian?: boolean
}



export type T_adminGetGuests = (request: {
  headers: T_adminGetGuests_headers
  query: T_adminGetGuests_query
}, base_url?: string) => Promise<AdminGuestList>;

export const method = 'get';
export const url_path = '/admin/guests';
export const alias = 'adminGetGuests';
export const is_streaming = false;
