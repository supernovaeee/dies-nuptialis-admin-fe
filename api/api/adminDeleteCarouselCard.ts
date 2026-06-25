
import type { DeletedResponse } from '../schema/DeletedResponse'

export interface T_adminDeleteCarouselCard_headers {
  authorization: string
}
export interface T_adminDeleteCarouselCard_path {
  card_id: string
}



export type T_adminDeleteCarouselCard = (request: {
  headers: T_adminDeleteCarouselCard_headers
  path: T_adminDeleteCarouselCard_path
}, base_url?: string) => Promise<DeletedResponse>;

export const method = 'delete';
export const url_path = '/admin/carousel-cards/:card_id';
export const alias = 'adminDeleteCarouselCard';
export const is_streaming = false;
