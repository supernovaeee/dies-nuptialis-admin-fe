import { CarouselCardList } from '../schema/CarouselCardList'





export type T_getCarouselCards = (request: {

}, base_url?: string) => Promise<CarouselCardList>;

export const method = 'get';
export const url_path = '/carousel-cards';
export const alias = 'getCarouselCards';
export const is_streaming = false;
