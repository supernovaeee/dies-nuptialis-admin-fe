
import type { ManagerMessageItem } from '../schema/ManagerMessageItem'

export interface T_managerUpdateMessage_headers {
  authorization: string
}
export interface T_managerUpdateMessage_body {
  message?: string
}



export type T_managerUpdateMessage = (request: {
  headers: T_managerUpdateMessage_headers
  body: T_managerUpdateMessage_body
}, base_url?: string) => Promise<ManagerMessageItem>;

export const method = 'patch';
export const url_path = '/manager/message';
export const alias = 'managerUpdateMessage';
export const is_streaming = false;
