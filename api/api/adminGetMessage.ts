
import type { AdminMessageItem } from '../schema/AdminMessageItem'

export interface T_adminGetMessage_headers {
  authorization: string
}



export type T_adminGetMessage = (request: {
  headers: T_adminGetMessage_headers
}, base_url?: string) => Promise<AdminMessageItem>;

export const method = 'get';
export const url_path = '/admin/message';
export const alias = 'adminGetMessage';
export const is_streaming = false;
