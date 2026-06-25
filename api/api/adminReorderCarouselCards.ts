
import { CarouselCardList } from '../schema/CarouselCardList'

export interface T_adminReorderCarouselCards_headers {
  authorization: string
}
export interface T_adminReorderCarouselCards_body {
  order: number[]
}



export type T_adminReorderCarouselCards = (request: {
  headers: T_adminReorderCarouselCards_headers
  body: T_adminReorderCarouselCards_body
}, base_url?: string) => Promise<CarouselCardList>;

export const method = 'patch';
export const url_path = '/admin/carousel-cards/reorder';
export const alias = 'adminReorderCarouselCards';
export const is_streaming = false;
