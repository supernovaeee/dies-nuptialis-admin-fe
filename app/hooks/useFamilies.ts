import { useQuery } from '@tanstack/react-query'
import { AxiosClient } from '@api/AxiosClient'
import type { AdminFamilyList } from '@api/schema/AdminFamilyList'
import { QUERY_KEYS } from '~/constants'
import { AUTH_HEADER } from '~/lib/authHeader'

export function useFamilies(q?: string, limit = 50, offset = 0) {
  return useQuery<AdminFamilyList>({
    queryKey: QUERY_KEYS.FAMILIES(q),
    queryFn: () =>
      AxiosClient.adminGetFamilies({
        headers: AUTH_HEADER,
        query: { limit, offset, q },
      }),
  })
}
