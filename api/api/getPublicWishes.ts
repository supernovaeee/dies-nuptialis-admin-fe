
import { WishPublicList } from '../schema/WishPublicList'

export interface T_getPublicWishes_query {
  limit?: number
  offset?: number
}



export type T_getPublicWishes = (request: {
  query: T_getPublicWishes_query
}, base_url?: string) => Promise<WishPublicList>;

export const method = 'get';
export const url_path = '/wishes';
export const alias = 'getPublicWishes';
export const is_streaming = false;
