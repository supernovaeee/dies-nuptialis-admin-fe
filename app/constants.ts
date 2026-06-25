export const TOKEN_KEY = 'dies_admin_token'

export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/',
  FAMILIES: '/families',
  FAMILY_DETAIL: (id: number | string) => `/families/${id}`,
  RSVPS: '/rsvps',
  WISHES: '/wishes',
  CAROUSEL: '/carousel',
} as const

export const QUERY_KEYS = {
  FAMILIES: (q?: string) => ['families', q] as const,
  FAMILY_LETTER: (familyId: string) => ['family', familyId, 'letter'] as const,
  RSVPS: (page: number) => ['rsvps', page] as const,
  RSVP_SUMMARY: ['rsvp-summary'] as const,
  WISHES: (page: number, status?: string) => ['wishes', page, status] as const,
  CAROUSEL_CARDS: ['carousel-cards'] as const,
} as const
