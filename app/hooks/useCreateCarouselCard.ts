import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosClient } from '@api/AxiosClient'
import type { T_adminCreateCarouselCard_body } from '@api/api/adminCreateCarouselCard'
import type { AdminCarouselCardItem } from '@api/schema/AdminCarouselCardItem'
import { QUERY_KEYS } from '~/constants'
import { AUTH_HEADER } from '~/lib/authHeader'

export function useCreateCarouselCard() {
  const queryClient = useQueryClient()

  return useMutation<AdminCarouselCardItem, unknown, T_adminCreateCarouselCard_body>({
    mutationFn: (body) =>
      AxiosClient.adminCreateCarouselCard({ headers: AUTH_HEADER, body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CAROUSEL_CARDS })
    },
  })
}
