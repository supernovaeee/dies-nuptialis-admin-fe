import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosClient } from '@api/AxiosClient'
import type { CarouselCardList } from '@api/schema/CarouselCardList'
import { QUERY_KEYS } from '~/constants'
import { AUTH_HEADER } from '~/lib/authHeader'

export function useReorderCarouselCards() {
  const queryClient = useQueryClient()

  return useMutation<CarouselCardList, unknown, number[]>({
    mutationFn: (order) =>
      AxiosClient.adminReorderCarouselCards({
        headers: AUTH_HEADER,
        body: { order },
      }),
    onSuccess: (data) => {
      queryClient.setQueryData(QUERY_KEYS.CAROUSEL_CARDS, data)
    },
  })
}
