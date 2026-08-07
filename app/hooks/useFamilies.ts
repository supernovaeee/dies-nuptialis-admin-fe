import { useQuery } from '@tanstack/react-query'
import { AxiosClient } from '@api/AxiosClient'
import type { AdminFamilyList } from '@api/schema/AdminFamilyList'
import { QUERY_KEYS } from '~/constants'
import { AUTH_HEADER } from '~/lib/authHeader'

export interface FamilyFilters {
  q?: string
  rsvpManagerId?: number
  rsvpStatus?: string
  hasLetter?: boolean
  guestsMin?: number
  guestsMax?: number
}

export function useFamilies(filters: FamilyFilters = {}, page = 0, limit = 50) {
  const { q, rsvpManagerId, rsvpStatus, hasLetter, guestsMin, guestsMax } = filters

  return useQuery<AdminFamilyList>({
    queryKey: QUERY_KEYS.FAMILIES(q, page, rsvpManagerId, rsvpStatus, hasLetter, guestsMin, guestsMax),
    queryFn: () =>
      AxiosClient.adminGetFamilies({
        headers: AUTH_HEADER,
        query: {
          limit,
          offset: page * limit,
          q,
          rsvp_manager_id: rsvpManagerId,
          rsvp_status: rsvpStatus,
          has_letter: hasLetter,
          guests_min: guestsMin,
          guests_max: guestsMax,
        },
      }),
  })
}
