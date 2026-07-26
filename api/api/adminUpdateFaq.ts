
import type { AdminFaqItem } from '../schema/AdminFaqItem'

export interface T_adminUpdateFaq_headers {
  authorization: string
}
export interface T_adminUpdateFaq_path {
  faq_id: string
}
export interface T_adminUpdateFaq_body {
  question?: string
  answer?: string
  archived?: boolean
}



export type T_adminUpdateFaq = (request: {
  headers: T_adminUpdateFaq_headers
  path: T_adminUpdateFaq_path
  body: T_adminUpdateFaq_body
}, base_url?: string) => Promise<AdminFaqItem>;

export const method = 'patch';
export const url_path = '/admin/faqs/:faq_id';
export const alias = 'adminUpdateFaq';
export const is_streaming = false;
