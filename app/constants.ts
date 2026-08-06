export const TOKEN_KEY = 'dies_admin_token'

export const GUEST_SITE_URL = 'https://amity.azzamarcel.com'

export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/',
  FAMILIES: '/families',
  FAMILY_DETAIL: (id: number | string) => `/families/${id}`,
  RSVPS: '/rsvps',
  WISHES: '/wishes',
  CAROUSEL: '/carousel',
  FAQ: '/faq',
} as const

export const QUERY_KEYS = {
  FAMILIES: (q?: string, page?: number) => ['families', q, page] as const,
  FAMILY: (familyId: string) => ['family', familyId] as const,
  FAMILY_LETTER: (familyId: string) => ['family', familyId, 'letter'] as const,
  RSVPS: (page: number) => ['rsvps', page] as const,
  RSVP_SUMMARY: ['rsvp-summary'] as const,
  WISHES: (page: number, status?: string) => ['wishes', page, status] as const,
  CAROUSEL_CARDS: ['carousel-cards'] as const,
  FAQS: ['faqs'] as const,
} as const
