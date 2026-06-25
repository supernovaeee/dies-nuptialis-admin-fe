
import type { CarouselCardItem } from '../schema/CarouselCardItem'

export interface T_adminUpdateCarouselCard_headers {
  authorization: string
}
export interface T_adminUpdateCarouselCard_path {
  card_id: string
}
export interface T_adminUpdateCarouselCard_body {
  title?: string
  image_url?: string
  content?: string
  sort_order?: number
}



export type T_adminUpdateCarouselCard = (request: {
  headers: T_adminUpdateCarouselCard_headers
  path: T_adminUpdateCarouselCard_path
  body: T_adminUpdateCarouselCard_body
}, base_url?: string) => Promise<CarouselCardItem>;

export const method = 'patch';
export const url_path = '/admin/carousel-cards/:card_id';
export const alias = 'adminUpdateCarouselCard';
export const is_streaming = false;
