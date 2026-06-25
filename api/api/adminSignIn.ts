
import { AdminAuthResponse } from '../schema/AdminAuthResponse'

export interface T_adminSignIn_body {
  email: string
  password: string
}



export type T_adminSignIn = (request: {
  body: T_adminSignIn_body
}, base_url?: string) => Promise<AdminAuthResponse>;

export const method = 'post';
export const url_path = '/admin/auth';
export const alias = 'adminSignIn';
export const is_streaming = false;
