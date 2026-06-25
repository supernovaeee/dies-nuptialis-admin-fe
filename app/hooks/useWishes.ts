import { useQuery } from '@tanstack/react-query'
import { AxiosClient } from '@api/AxiosClient'
import type { AdminWishList } from '@api/schema/AdminWishList'
import { QUERY_KEYS } from '~/constants'
import { AUTH_HEADER } from '~/lib/authHeader'

export function useWishes(page = 0, limit = 50, status?: string) {
  return useQuery<AdminWishList>({
    queryKey: QUERY_KEYS.WISHES(page, status),
    queryFn: () =>
      AxiosClient.adminGetWishes({
        headers: AUTH_HEADER,
        query: { limit, offset: page * limit, status },
      }),
  })
}
