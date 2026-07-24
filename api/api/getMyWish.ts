
import type { WishPublicItem } from '../schema/WishPublicItem'

export interface T_getMyWish_headers {
  authorization: string
}



export type T_getMyWish = (request: {
  headers: T_getMyWish_headers
}, base_url?: string) => Promise<WishPublicItem | null>;

export const method = 'get';
export const url_path = '/wishes/mine';
export const alias = 'getMyWish';
export const is_streaming = false;
