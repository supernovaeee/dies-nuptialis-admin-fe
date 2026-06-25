import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosClient } from '@api/AxiosClient'
import type { WishModerationResponse } from '@api/schema/WishModerationResponse'
import { AUTH_HEADER } from '~/lib/authHeader'

interface ModerateWishVars {
  wishId: string
  status: string
}

export function useModerateWish() {
  const queryClient = useQueryClient()

  return useMutation<WishModerationResponse, unknown, ModerateWishVars>({
    mutationFn: ({ wishId, status }) =>
      AxiosClient.adminModerateWish({
        headers: AUTH_HEADER,
        path: { wish_id: wishId },
        body: { status },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishes'] })
    },
  })
}
