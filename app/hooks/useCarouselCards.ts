import { useQuery } from '@tanstack/react-query'
import { AxiosClient } from '@api/AxiosClient'
import type { CarouselCardList } from '@api/schema/CarouselCardList'
import { QUERY_KEYS } from '~/constants'
import { AUTH_HEADER } from '~/lib/authHeader'

export function useCarouselCards() {
  return useQuery<CarouselCardList>({
    queryKey: QUERY_KEYS.CAROUSEL_CARDS,
    queryFn: () =>
      AxiosClient.adminGetCarouselCards({ headers: AUTH_HEADER }),
  })
}
