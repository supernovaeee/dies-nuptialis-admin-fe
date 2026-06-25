
import type { CarouselCardList } from '../schema/CarouselCardList'

export interface T_adminGetCarouselCards_headers {
  authorization: string
}



export type T_adminGetCarouselCards = (request: {
  headers: T_adminGetCarouselCards_headers
}, base_url?: string) => Promise<CarouselCardList>;

export const method = 'get';
export const url_path = '/admin/carousel-cards';
export const alias = 'adminGetCarouselCards';
export const is_streaming = false;
