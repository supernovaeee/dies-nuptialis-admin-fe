import { useQuery } from '@tanstack/react-query'
import { AxiosClient } from '@api/AxiosClient'
import type { AdminMessageItem } from '@api/schema/AdminMessageItem'
import { QUERY_KEYS } from '~/constants'
import { AUTH_HEADER } from '~/lib/authHeader'

export function useAdminMessage() {
  return useQuery<AdminMessageItem>({
    queryKey: QUERY_KEYS.ADMIN_MESSAGE,
    queryFn: () => AxiosClient.adminGetMessage({ headers: AUTH_HEADER }),
  })
}
