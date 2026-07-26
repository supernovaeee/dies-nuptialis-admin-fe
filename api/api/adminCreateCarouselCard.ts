
import type { AdminCarouselCardItem } from '../schema/AdminCarouselCardItem'

export interface T_adminCreateCarouselCard_headers {
  authorization: string
}
export interface T_adminCreateCarouselCard_body {
  title?: string
  image_url?: string
  content?: string
  sort_order?: number
  archived?: boolean
}



export type T_adminCreateCarouselCard = (request: {
  headers: T_adminCreateCarouselCard_headers
  body: T_adminCreateCarouselCard_body
}, base_url?: string) => Promise<AdminCarouselCardItem>;

export const method = 'post';
export const url_path = '/admin/carousel-cards';
export const alias = 'adminCreateCarouselCard';
export const is_streaming = false;
