
import { UploadResponse } from '../schema/UploadResponse'

export interface T_adminUploadImage_headers {
  authorization: string
}
export interface T_adminUploadImage_body {
  data: string
}



export type T_adminUploadImage = (request: {
  headers: T_adminUploadImage_headers
  body: T_adminUploadImage_body
}, base_url?: string) => Promise<UploadResponse>;

export const method = 'post';
export const url_path = '/admin/upload/image';
export const alias = 'adminUploadImage';
export const is_streaming = false;
