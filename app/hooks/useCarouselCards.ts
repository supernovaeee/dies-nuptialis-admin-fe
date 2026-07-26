import { useQuery } from '@tanstack/react-query'
import { AxiosClient } from '@api/AxiosClient'
import type { AdminCarouselCardList } from '@api/schema/AdminCarouselCardList'
import { QUERY_KEYS } from '~/constants'
import { AUTH_HEADER } from '~/lib/authHeader'

export function useCarouselCards() {
  return useQuery<AdminCarouselCardList>({
    queryKey: QUERY_KEYS.CAROUSEL_CARDS,
    queryFn: () =>
      AxiosClient.adminGetCarouselCards({ headers: AUTH_HEADER }),
  })
}
