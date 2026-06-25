
import { DeletedResponse } from '../schema/DeletedResponse'

export interface T_adminDeleteFamily_headers {
  authorization: string
}
export interface T_adminDeleteFamily_path {
  family_id: string
}



export type T_adminDeleteFamily = (request: {
  headers: T_adminDeleteFamily_headers
  path: T_adminDeleteFamily_path
}, base_url?: string) => Promise<DeletedResponse>;

export const method = 'delete';
export const url_path = '/admin/families/:family_id';
export const alias = 'adminDeleteFamily';
export const is_streaming = false;
