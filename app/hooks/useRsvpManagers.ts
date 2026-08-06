import { useQuery } from '@tanstack/react-query'
import { AxiosClient } from '@api/AxiosClient'
import type { AdminRsvpManagerList } from '@api/schema/AdminRsvpManagerList'
import { QUERY_KEYS } from '~/constants'
import { AUTH_HEADER } from '~/lib/authHeader'

export function useRsvpManagers(q?: string, page = 0, limit = 50) {
  return useQuery<AdminRsvpManagerList>({
    queryKey: QUERY_KEYS.RSVP_MANAGERS(q, page),
    queryFn: () =>
      AxiosClient.adminGetRsvpManagers({
        headers: AUTH_HEADER,
        query: { limit, offset: page * limit, q },
      }),
  })
}
