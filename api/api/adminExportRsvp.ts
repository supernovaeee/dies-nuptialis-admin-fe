

export interface T_adminExportRsvp_headers {
  authorization: string
}



export type T_adminExportRsvp = (request: {
  headers: T_adminExportRsvp_headers
}, base_url?: string) => Promise<string>;

export const method = 'get';
export const url_path = '/admin/export/rsvp';
export const alias = 'adminExportRsvp';
export const is_streaming = false;
