
import { LetterResponse } from '../schema/LetterResponse'

export interface T_adminUpsertLetter_headers {
  authorization: string
}
export interface T_adminUpsertLetter_path {
  family_id: string
}
export interface T_adminUpsertLetter_body {
  letter_text: string
}



export type T_adminUpsertLetter = (request: {
  headers: T_adminUpsertLetter_headers
  path: T_adminUpsertLetter_path
  body: T_adminUpsertLetter_body
}, base_url?: string) => Promise<LetterResponse>;

export const method = 'put';
export const url_path = '/admin/families/:family_id/letter';
export const alias = 'adminUpsertLetter';
export const is_streaming = false;
