
import { WishPublicItem } from '../schema/WishPublicItem'

export interface T_submitWish_headers {
  authorization: string
}
export interface T_submitWish_body {
  guest_given_name?: string
  message_text: string
  image_url?: string
}



export type T_submitWish = (request: {
  headers: T_submitWish_headers
  body: T_submitWish_body
}, base_url?: string) => Promise<WishPublicItem>;

export const method = 'post';
export const url_path = '/wishes';
export const alias = 'submitWish';
export const is_streaming = false;
