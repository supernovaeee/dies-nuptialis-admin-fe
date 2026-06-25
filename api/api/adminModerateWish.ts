
import type { WishModerationResponse } from '../schema/WishModerationResponse'

export interface T_adminModerateWish_headers {
  authorization: string
}
export interface T_adminModerateWish_path {
  wish_id: string
}
export interface T_adminModerateWish_body {
  status: string
}



export type T_adminModerateWish = (request: {
  headers: T_adminModerateWish_headers
  path: T_adminModerateWish_path
  body: T_adminModerateWish_body
}, base_url?: string) => Promise<WishModerationResponse>;

export const method = 'patch';
export const url_path = '/admin/wishes/:wish_id';
export const alias = 'adminModerateWish';
export const is_streaming = false;
