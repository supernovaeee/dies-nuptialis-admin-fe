
import { AdminFamilyList } from '../schema/AdminFamilyList'

export interface T_adminGetFamilies_headers {
  authorization: string
}
export interface T_adminGetFamilies_query {
  limit?: number
  offset?: number
  q?: string
}



export type T_adminGetFamilies = (request: {
  headers: T_adminGetFamilies_headers
  query: T_adminGetFamilies_query
}, base_url?: string) => Promise<AdminFamilyList>;

export const method = 'get';
export const url_path = '/admin/families';
export const alias = 'adminGetFamilies';
export const is_streaming = false;
