
import type { GuestItem } from '../schema/GuestItem'

export interface T_adminAddGuest_headers {
  authorization: string
}
export interface T_adminAddGuest_path {
  family_id: string
}
export interface T_adminAddGuest_body {
  name: string
  vegetarian?: boolean
}



export type T_adminAddGuest = (request: {
  headers: T_adminAddGuest_headers
  path: T_adminAddGuest_path
  body: T_adminAddGuest_body
}, base_url?: string) => Promise<GuestItem>;

export const method = 'post';
export const url_path = '/admin/families/:family_id/guests';
export const alias = 'adminAddGuest';
export const is_streaming = false;
