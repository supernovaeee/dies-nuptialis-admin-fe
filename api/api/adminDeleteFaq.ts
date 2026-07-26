
import type { DeletedResponse } from '../schema/DeletedResponse'

export interface T_adminDeleteFaq_headers {
  authorization: string
}
export interface T_adminDeleteFaq_path {
  faq_id: string
}



export type T_adminDeleteFaq = (request: {
  headers: T_adminDeleteFaq_headers
  path: T_adminDeleteFaq_path
}, base_url?: string) => Promise<DeletedResponse>;

export const method = 'delete';
export const url_path = '/admin/faqs/:faq_id';
export const alias = 'adminDeleteFaq';
export const is_streaming = false;
