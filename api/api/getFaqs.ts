import type { FaqList } from '../schema/FaqList'





export type T_getFaqs = (request: {

}, base_url?: string) => Promise<FaqList>;

export const method = 'get';
export const url_path = '/faqs';
export const alias = 'getFaqs';
export const is_streaming = false;
