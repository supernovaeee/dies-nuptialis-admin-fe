
import type { AdminFaqItem } from '../schema/AdminFaqItem'

export interface T_adminCreateFaq_headers {
  authorization: string
}
export interface T_adminCreateFaq_body {
  question: string
  answer: string
  archived?: boolean
}



export type T_adminCreateFaq = (request: {
  headers: T_adminCreateFaq_headers
  body: T_adminCreateFaq_body
}, base_url?: string) => Promise<AdminFaqItem>;

export const method = 'post';
export const url_path = '/admin/faqs';
export const alias = 'adminCreateFaq';
export const is_streaming = false;
