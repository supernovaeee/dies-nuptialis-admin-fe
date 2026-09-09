import { useQuery } from '@tanstack/react-query'
import { AxiosClient } from '@api/AxiosClient'
import type { ManagerFamilyList } from '@api/schema/ManagerFamilyList'
import { QUERY_KEYS } from '~/constants'
import { AUTH_HEADER } from '~/lib/authHeader'

export function useManagerFamilies(page = 0, limit = 20) {
  return useQuery<ManagerFamilyList>({
    queryKey: QUERY_KEYS.MANAGER_FAMILIES(page),
    queryFn: () =>
      AxiosClient.managerGetFamilies({
        headers: AUTH_HEADER,
        query: { limit, offset: page * limit },
      }),
  })
}
