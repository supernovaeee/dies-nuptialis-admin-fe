import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosClient } from '@api/AxiosClient'
import type { DeletedResponse } from '@api/schema/DeletedResponse'
import { AUTH_HEADER } from '~/lib/authHeader'

export function useDeleteRsvpManager() {
  const queryClient = useQueryClient()

  return useMutation<DeletedResponse, unknown, string>({
    mutationFn: (managerId) =>
      AxiosClient.adminDeleteRsvpManager({
        headers: AUTH_HEADER,
        path: { manager_id: managerId },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rsvp-managers'] })
      queryClient.invalidateQueries({ queryKey: ['families'] })
    },
  })
}
