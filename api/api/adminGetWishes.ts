
import { AdminWishList } from '../schema/AdminWishList'

export interface T_adminGetWishes_headers {
  authorization: string
}
export interface T_adminGetWishes_query {
  limit?: number
  offset?: number
  status?: string
}



export type T_adminGetWishes = (request: {
  headers: T_adminGetWishes_headers
  query: T_adminGetWishes_query
}, base_url?: string) => Promise<AdminWishList>;

export const method = 'get';
export const url_path = '/admin/wishes';
export const alias = 'adminGetWishes';
export const is_streaming = false;
