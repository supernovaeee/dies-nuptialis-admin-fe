import { useQuery } from '@tanstack/react-query'
import { AxiosClient } from '@api/AxiosClient'
import type { AdminFamilyList } from '@api/schema/AdminFamilyList'
import { QUERY_KEYS } from '~/constants'
import { AUTH_HEADER } from '~/lib/authHeader'

export function useFamilies(q?: string, page = 0, limit = 50) {
  return useQuery<AdminFamilyList>({
    queryKey: QUERY_KEYS.FAMILIES(q, page),
    queryFn: () =>
      AxiosClient.adminGetFamilies({
        headers: AUTH_HEADER,
        query: { limit, offset: page * limit, q },
      }),
  })
}
