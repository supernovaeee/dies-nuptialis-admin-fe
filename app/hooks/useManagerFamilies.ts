import { useQuery } from '@tanstack/react-query'
import { AxiosClient } from '@api/AxiosClient'
import type { ManagerFamilyList } from '@api/schema/ManagerFamilyList'
import { QUERY_KEYS } from '~/constants'
import { AUTH_HEADER } from '~/lib/authHeader'

export function useManagerFamilies() {
  return useQuery<ManagerFamilyList>({
    queryKey: QUERY_KEYS.MANAGER_FAMILIES,
    queryFn: () => AxiosClient.managerGetFamilies({ headers: AUTH_HEADER }),
  })
}
