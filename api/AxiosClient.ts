import axios from 'axios';
import { T_adminSignIn } from "./api/adminSignIn";
import { T_adminGetFamilies } from "./api/adminGetFamilies";
import { T_adminCreateFamily } from "./api/adminCreateFamily";
import { T_adminUpdateFamily } from "./api/adminUpdateFamily";
import { T_adminDeleteFamily } from "./api/adminDeleteFamily";
import { T_adminAddGuest } from "./api/adminAddGuest";
import { T_adminUpdateGuest } from "./api/adminUpdateGuest";
import { T_adminDeleteGuest } from "./api/adminDeleteGuest";
import { T_adminUpsertLetter } from "./api/adminUpsertLetter";
import { T_adminGetLetter } from "./api/adminGetLetter";
import { T_adminGetRsvps } from "./api/adminGetRsvps";
import { T_adminGetRsvpSummary } from "./api/adminGetRsvpSummary";
import { T_adminGetWishes } from "./api/adminGetWishes";
import { T_adminModerateWish } from "./api/adminModerateWish";
import { T_adminExportRsvp } from "./api/adminExportRsvp";
import { T_adminGetCarouselCards } from "./api/adminGetCarouselCards";
import { T_adminCreateCarouselCard } from "./api/adminCreateCarouselCard";
import { T_adminReorderCarouselCards } from "./api/adminReorderCarouselCards";
import { T_adminUpdateCarouselCard } from "./api/adminUpdateCarouselCard";
import { T_adminDeleteCarouselCard } from "./api/adminDeleteCarouselCard";
import { T_adminUploadImage } from "./api/adminUploadImage";
import { T_authGuestFamily } from "./api/authGuestFamily";
import { T_submitRsvp } from "./api/submitRsvp";
import { T_getRsvp } from "./api/getRsvp";
import { T_submitWish } from "./api/submitWish";
import { T_getPublicWishes } from "./api/getPublicWishes";
import { T_guestGetGuests } from "./api/guestGetGuests";
import { T_guestAddGuest } from "./api/guestAddGuest";
import { T_guestUpdateGuest } from "./api/guestUpdateGuest";
import { T_guestDeleteGuest } from "./api/guestDeleteGuest";
import { T_getCarouselCards } from "./api/getCarouselCards";

export type OnMessage<T> = (chunk: T, is_complete: boolean) => void;
export interface StreamResponse<T> {
  cancel(): void
  stream(onMessage: OnMessage<T>): Promise<void>
}

export namespace AxiosClient {

  function __build_path(base_url: string, url_path: string, path_param: { [key: string]: any }) {
    const build_path = url_path.replace(/:([a-zA-Z_]\w*)/g, (_, key) => {
      if (path_param[key] === undefined) {
        throw new Error(`Missing param: ${key}`);
      }
      return encodeURIComponent(String(path_param[key]));
    });
    const url = new URL((base_url.endsWith('/') ? base_url : base_url + '/') + build_path.replace(/^\/+/, ''));
    return url.toString();
  }
  export class BaseURL {
    public base_url: string = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
    static _instance: BaseURL | undefined;
    public static get instance(): BaseURL {
      if (!BaseURL._instance) {
        BaseURL._instance = new BaseURL();
      }
      return BaseURL._instance;
    }
    private constructor(){}
    public set(_base_url: string) {
      this.base_url = _base_url;
    }
  }

  export const adminSignIn: T_adminSignIn = async (req, base_url: string = BaseURL.instance.base_url) => {
    const final_url = __build_path(base_url, '/admin/auth', {});
    return (await axios['post'](final_url, req.body, { })).data as any;
  }
  export const adminGetFamilies: T_adminGetFamilies = async (req, base_url: string = BaseURL.instance.base_url) => {
    const final_url = __build_path(base_url, '/admin/families', {});
    return (await axios['get'](final_url, { headers: req.headers as any, params: req.query as any, })).data as any;
  }
  export const adminCreateFamily: T_adminCreateFamily = async (req, base_url: string = BaseURL.instance.base_url) => {
    const final_url = __build_path(base_url, '/admin/families', {});
    return (await axios['post'](final_url, req.body, { headers: req.headers as any, })).data as any;
  }
  export const adminUpdateFamily: T_adminUpdateFamily = async (req, base_url: string = BaseURL.instance.base_url) => {
    const final_url = __build_path(base_url, '/admin/families/:family_id', req.path);
    return (await axios['patch'](final_url, req.body, { headers: req.headers as any, })).data as any;
  }
  export const adminDeleteFamily: T_adminDeleteFamily = async (req, base_url: string = BaseURL.instance.base_url) => {
    const final_url = __build_path(base_url, '/admin/families/:family_id', req.path);
    return (await axios['delete'](final_url, { headers: req.headers as any, })).data as any;
  }
  export const adminAddGuest: T_adminAddGuest = async (req, base_url: string = BaseURL.instance.base_url) => {
    const final_url = __build_path(base_url, '/admin/families/:family_id/guests', req.path);
    return (await axios['post'](final_url, req.body, { headers: req.headers as any, })).data as any;
  }
  export const adminUpdateGuest: T_adminUpdateGuest = async (req, base_url: string = BaseURL.instance.base_url) => {
    const final_url = __build_path(base_url, '/admin/guests/:guest_id', req.path);
    return (await axios['patch'](final_url, req.body, { headers: req.headers as any, })).data as any;
  }
  export const adminDeleteGuest: T_adminDeleteGuest = async (req, base_url: string = BaseURL.instance.base_url) => {
    const final_url = __build_path(base_url, '/admin/guests/:guest_id', req.path);
    return (await axios['delete'](final_url, { headers: req.headers as any, })).data as any;
  }
  export const adminUpsertLetter: T_adminUpsertLetter = async (req, base_url: string = BaseURL.instance.base_url) => {
    const final_url = __build_path(base_url, '/admin/families/:family_id/letter', req.path);
    return (await axios['put'](final_url, req.body, { headers: req.headers as any, })).data as any;
  }
  export const adminGetLetter: T_adminGetLetter = async (req, base_url: string = BaseURL.instance.base_url) => {
    const final_url = __build_path(base_url, '/admin/families/:family_id/letter', req.path);
    return (await axios['get'](final_url, { headers: req.headers as any, })).data as any;
  }
  export const adminGetRsvps: T_adminGetRsvps = async (req, base_url: string = BaseURL.instance.base_url) => {
    const final_url = __build_path(base_url, '/admin/rsvps', {});
    return (await axios['get'](final_url, { headers: req.headers as any, params: req.query as any, })).data as any;
  }
  export const adminGetRsvpSummary: T_adminGetRsvpSummary = async (req, base_url: string = BaseURL.instance.base_url) => {
    const final_url = __build_path(base_url, '/admin/rsvp-summary', {});
    return (await axios['get'](final_url, { headers: req.headers as any, })).data as any;
  }
  export const adminGetWishes: T_adminGetWishes = async (req, base_url: string = BaseURL.instance.base_url) => {
    const final_url = __build_path(base_url, '/admin/wishes', {});
    return (await axios['get'](final_url, { headers: req.headers as any, params: req.query as any, })).data as any;
  }
  export const adminModerateWish: T_adminModerateWish = async (req, base_url: string = BaseURL.instance.base_url) => {
    const final_url = __build_path(base_url, '/admin/wishes/:wish_id', req.path);
    return (await axios['patch'](final_url, req.body, { headers: req.headers as any, })).data as any;
  }
  export const adminExportRsvp: T_adminExportRsvp = async (req, base_url: string = BaseURL.instance.base_url) => {
    const final_url = __build_path(base_url, '/admin/export/rsvp', {});
    return (await axios['get'](final_url, { headers: req.headers as any, })).data as any;
  }
  export const adminGetCarouselCards: T_adminGetCarouselCards = async (req, base_url: string = BaseURL.instance.base_url) => {
    const final_url = __build_path(base_url, '/admin/carousel-cards', {});
    return (await axios['get'](final_url, { headers: req.headers as any, })).data as any;
  }
  export const adminCreateCarouselCard: T_adminCreateCarouselCard = async (req, base_url: string = BaseURL.instance.base_url) => {
    const final_url = __build_path(base_url, '/admin/carousel-cards', {});
    return (await axios['post'](final_url, req.body, { headers: req.headers as any, })).data as any;
  }
  export const adminReorderCarouselCards: T_adminReorderCarouselCards = async (req, base_url: string = BaseURL.instance.base_url) => {
    const final_url = __build_path(base_url, '/admin/carousel-cards/reorder', {});
    return (await axios['patch'](final_url, req.body, { headers: req.headers as any, })).data as any;
  }
  export const adminUpdateCarouselCard: T_adminUpdateCarouselCard = async (req, base_url: string = BaseURL.instance.base_url) => {
    const final_url = __build_path(base_url, '/admin/carousel-cards/:card_id', req.path);
    return (await axios['patch'](final_url, req.body, { headers: req.headers as any, })).data as any;
  }
  export const adminDeleteCarouselCard: T_adminDeleteCarouselCard = async (req, base_url: string = BaseURL.instance.base_url) => {
    const final_url = __build_path(base_url, '/admin/carousel-cards/:card_id', req.path);
    return (await axios['delete'](final_url, { headers: req.headers as any, })).data as any;
  }
  export const adminUploadImage: T_adminUploadImage = async (req, base_url: string = BaseURL.instance.base_url) => {
    const final_url = __build_path(base_url, '/admin/upload/image', {});
    return (await axios['post'](final_url, req.body, { headers: req.headers as any, })).data as any;
  }
  export const authGuestFamily: T_authGuestFamily = async (req, base_url: string = BaseURL.instance.base_url) => {
    const final_url = __build_path(base_url, '/auth/guest', {});
    return (await axios['post'](final_url, req.body, { })).data as any;
  }
  export const submitRsvp: T_submitRsvp = async (req, base_url: string = BaseURL.instance.base_url) => {
    const final_url = __build_path(base_url, '/rsvp', {});
    return (await axios['post'](final_url, req.body, { headers: req.headers as any, })).data as any;
  }
  export const getRsvp: T_getRsvp = async (req, base_url: string = BaseURL.instance.base_url) => {
    const final_url = __build_path(base_url, '/rsvp', {});
    return (await axios['get'](final_url, { headers: req.headers as any, })).data as any;
  }
  export const submitWish: T_submitWish = async (req, base_url: string = BaseURL.instance.base_url) => {
    const final_url = __build_path(base_url, '/wishes', {});
    return (await axios['post'](final_url, req.body, { headers: req.headers as any, })).data as any;
  }
  export const getPublicWishes: T_getPublicWishes = async (req, base_url: string = BaseURL.instance.base_url) => {
    const final_url = __build_path(base_url, '/wishes', {});
    return (await axios['get'](final_url, { params: req.query as any, })).data as any;
  }
  export const guestGetGuests: T_guestGetGuests = async (req, base_url: string = BaseURL.instance.base_url) => {
    const final_url = __build_path(base_url, '/guests', {});
    return (await axios['get'](final_url, { headers: req.headers as any, })).data as any;
  }
  export const guestAddGuest: T_guestAddGuest = async (req, base_url: string = BaseURL.instance.base_url) => {
    const final_url = __build_path(base_url, '/guests', {});
    return (await axios['post'](final_url, req.body, { headers: req.headers as any, })).data as any;
  }
  export const guestUpdateGuest: T_guestUpdateGuest = async (req, base_url: string = BaseURL.instance.base_url) => {
    const final_url = __build_path(base_url, '/guests/:guest_id', req.path);
    return (await axios['patch'](final_url, req.body, { headers: req.headers as any, })).data as any;
  }
  export const guestDeleteGuest: T_guestDeleteGuest = async (req, base_url: string = BaseURL.instance.base_url) => {
    const final_url = __build_path(base_url, '/guests/:guest_id', req.path);
    return (await axios['delete'](final_url, { headers: req.headers as any, })).data as any;
  }
  export const getCarouselCards: T_getCarouselCards = async (req, base_url: string = BaseURL.instance.base_url) => {
    const final_url = __build_path(base_url, '/carousel-cards', {});
    return (await axios['get'](final_url, { })).data as any;
  }
}