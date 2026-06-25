import { useQuery } from '@tanstack/react-query'
import { AxiosClient } from '@api/AxiosClient'
import type { AdminRsvpSummary } from '@api/schema/AdminRsvpSummary'
import { QUERY_KEYS } from '~/constants'
import { AUTH_HEADER } from '~/lib/authHeader'

export function useRsvpSummary() {
  return useQuery<AdminRsvpSummary>({
    queryKey: QUERY_KEYS.RSVP_SUMMARY,
    queryFn: () =>
      AxiosClient.adminGetRsvpSummary({ headers: AUTH_HEADER }),
  })
}
