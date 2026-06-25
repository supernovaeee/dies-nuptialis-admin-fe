import { useQuery } from '@tanstack/react-query'
import { AxiosClient } from '@api/AxiosClient'
import type { AdminRsvpList } from '@api/schema/AdminRsvpList'
import { QUERY_KEYS } from '~/constants'
import { AUTH_HEADER } from '~/lib/authHeader'

export function useRsvps(page = 0, limit = 50) {
  return useQuery<AdminRsvpList>({
    queryKey: QUERY_KEYS.RSVPS(page),
    queryFn: () =>
      AxiosClient.adminGetRsvps({
        headers: AUTH_HEADER,
        query: { limit, offset: page * limit },
      }),
  })
}
