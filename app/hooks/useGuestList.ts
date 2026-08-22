import { useQuery } from '@tanstack/react-query'
import { AxiosClient } from '@api/AxiosClient'
import type { AdminGuestList } from '@api/schema/AdminGuestList'
import { QUERY_KEYS } from '~/constants'
import { AUTH_HEADER } from '~/lib/authHeader'

export interface GuestFilters {
  q?: string
  vegetarian?: boolean
}

export function useGuestList(filters: GuestFilters = {}, page = 0, limit = 50) {
  const { q, vegetarian } = filters

  return useQuery<AdminGuestList>({
    queryKey: QUERY_KEYS.GUESTS(q, page, vegetarian),
    queryFn: () =>
      AxiosClient.adminGetGuests({
        headers: AUTH_HEADER,
        query: {
          limit,
          offset: page * limit,
          q,
          vegetarian,
        },
      }),
  })
}
