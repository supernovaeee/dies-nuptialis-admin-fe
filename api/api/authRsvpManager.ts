
import type { RsvpManagerAuthResponse } from '../schema/RsvpManagerAuthResponse'

export interface T_authRsvpManager_body {
  passcode: string
}



export type T_authRsvpManager = (request: {
  body: T_authRsvpManager_body
}, base_url?: string) => Promise<RsvpManagerAuthResponse>;

export const method = 'post';
export const url_path = '/auth/manager';
export const alias = 'authRsvpManager';
export const is_streaming = false;
