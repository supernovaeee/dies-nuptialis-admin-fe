
import type { DeletedResponse } from '../schema/DeletedResponse'

export interface T_deleteMyWish_headers {
  authorization: string
}



export type T_deleteMyWish = (request: {
  headers: T_deleteMyWish_headers
}, base_url?: string) => Promise<DeletedResponse>;

export const method = 'delete';
export const url_path = '/wishes/mine';
export const alias = 'deleteMyWish';
export const is_streaming = false;
