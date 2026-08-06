
import type { AdminFamilyItem } from '../schema/AdminFamilyItem'

export interface T_adminGetFamily_headers {
  authorization: string
}
export interface T_adminGetFamily_path {
  family_id: string
}



export type T_adminGetFamily = (request: {
  headers: T_adminGetFamily_headers
  path: T_adminGetFamily_path
}, base_url?: string) => Promise<AdminFamilyItem>;

export const method = 'get';
export const url_path = '/admin/families/:family_id';
export const alias = 'adminGetFamily';
export const is_streaming = false;
