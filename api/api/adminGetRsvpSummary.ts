
import { AdminRsvpSummary } from '../schema/AdminRsvpSummary'

export interface T_adminGetRsvpSummary_headers {
  authorization: string
}



export type T_adminGetRsvpSummary = (request: {
  headers: T_adminGetRsvpSummary_headers
}, base_url?: string) => Promise<AdminRsvpSummary>;

export const method = 'get';
export const url_path = '/admin/rsvp-summary';
export const alias = 'adminGetRsvpSummary';
export const is_streaming = false;
