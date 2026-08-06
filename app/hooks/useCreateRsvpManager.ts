import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosClient } from '@api/AxiosClient'
import type { T_adminCreateRsvpManager_body } from '@api/api/adminCreateRsvpManager'
import type { AdminRsvpManagerItem } from '@api/schema/AdminRsvpManagerItem'
import { AUTH_HEADER } from '~/lib/authHeader'

export function useCreateRsvpManager() {
  const queryClient = useQueryClient()

  return useMutation<AdminRsvpManagerItem, unknown, T_adminCreateRsvpManager_body>({
    mutationFn: (body) =>
      AxiosClient.adminCreateRsvpManager({ headers: AUTH_HEADER, body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rsvp-managers'] })
    },
  })
}
