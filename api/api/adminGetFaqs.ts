
import type { AdminFaqList } from '../schema/AdminFaqList'

export interface T_adminGetFaqs_headers {
  authorization: string
}



export type T_adminGetFaqs = (request: {
  headers: T_adminGetFaqs_headers
}, base_url?: string) => Promise<AdminFaqList>;

export const method = 'get';
export const url_path = '/admin/faqs';
export const alias = 'adminGetFaqs';
export const is_streaming = false;
