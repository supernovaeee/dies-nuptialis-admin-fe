
import type { CarouselCardItem } from '../schema/CarouselCardItem'

export interface T_adminCreateCarouselCard_headers {
  authorization: string
}
export interface T_adminCreateCarouselCard_body {
  title?: string
  image_url?: string
  content?: string
  sort_order?: number
}



export type T_adminCreateCarouselCard = (request: {
  headers: T_adminCreateCarouselCard_headers
  body: T_adminCreateCarouselCard_body
}, base_url?: string) => Promise<CarouselCardItem>;

export const method = 'post';
export const url_path = '/admin/carousel-cards';
export const alias = 'adminCreateCarouselCard';
export const is_streaming = false;
