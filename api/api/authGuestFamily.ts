
import { FamilyAuthResponse } from '../schema/FamilyAuthResponse'

export interface T_authGuestFamily_body {
  invite_code: string
}



export type T_authGuestFamily = (request: {
  body: T_authGuestFamily_body
}, base_url?: string) => Promise<FamilyAuthResponse>;

export const method = 'post';
export const url_path = '/auth/guest';
export const alias = 'authGuestFamily';
export const is_streaming = false;
