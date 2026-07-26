import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosClient } from '@api/AxiosClient'
import type { T_adminUpdateCarouselCard_body } from '@api/api/adminUpdateCarouselCard'
import type { AdminCarouselCardItem } from '@api/schema/AdminCarouselCardItem'
import { QUERY_KEYS } from '~/constants'
import { AUTH_HEADER } from '~/lib/authHeader'

interface UpdateCarouselCardVars {
  cardId: string
  body: T_adminUpdateCarouselCard_body
}

export function useUpdateCarouselCard() {
  const queryClient = useQueryClient()

  return useMutation<AdminCarouselCardItem, unknown, UpdateCarouselCardVars>({
    mutationFn: ({ cardId, body }) =>
      AxiosClient.adminUpdateCarouselCard({
        headers: AUTH_HEADER,
        path: { card_id: cardId },
        body,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CAROUSEL_CARDS })
    },
  })
}
