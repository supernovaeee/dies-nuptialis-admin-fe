
import type { ManagerFamilyList } from '../schema/ManagerFamilyList'

export interface T_managerGetFamilies_headers {
  authorization: string
}



export type T_managerGetFamilies = (request: {
  headers: T_managerGetFamilies_headers
}, base_url?: string) => Promise<ManagerFamilyList>;

export const method = 'get';
export const url_path = '/manager/families';
export const alias = 'managerGetFamilies';
export const is_streaming = false;
