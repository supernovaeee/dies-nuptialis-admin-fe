
import { LetterResponse } from '../schema/LetterResponse'

export interface T_adminGetLetter_headers {
  authorization: string
}
export interface T_adminGetLetter_path {
  family_id: string
}



export type T_adminGetLetter = (request: {
  headers: T_adminGetLetter_headers
  path: T_adminGetLetter_path
}, base_url?: string) => Promise<LetterResponse>;

export const method = 'get';
export const url_path = '/admin/families/:family_id/letter';
export const alias = 'adminGetLetter';
export const is_streaming = false;
