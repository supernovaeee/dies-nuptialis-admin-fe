
import type { AdminMessageItem } from '../schema/AdminMessageItem'

export interface T_adminUpdateMessage_headers {
  authorization: string
}
export interface T_adminUpdateMessage_body {
  message?: string
}



export type T_adminUpdateMessage = (request: {
  headers: T_adminUpdateMessage_headers
  body: T_adminUpdateMessage_body
}, base_url?: string) => Promise<AdminMessageItem>;

export const method = 'patch';
export const url_path = '/admin/message';
export const alias = 'adminUpdateMessage';
export const is_streaming = false;
